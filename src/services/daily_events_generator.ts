import { EventTemplate } from "src/models/event_template.ts";
import { Event } from "src/models/event.ts";
import { Daily } from "src/models/event_template_types/daily.ts";
import { doRangesIntersect } from "src/services/do_ranges_intersect.ts";

const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

export class DailyEventsGenerator {
  private _template!: EventTemplate<Daily>;
  private _events: Event<Daily>[] = [];
  private _startDate!: Date;
  private _endDate!: Date;

  generate(
    template: EventTemplate<Daily>,
    startDate: Date,
    endDate: Date
  ): Event<Daily>[] {
    this._template = template;
    this._startDate = startDate;
    this._endDate = endDate;
    this._events = [];

    const isDeleted = this._template.deletedOn != null;
    
    if (isDeleted) {
      return this._events;
    }

    if (this._template.type.repeatEvery === 0) {
      this.generateNonRepeatingEvents();
    } else {
      this.generateRepeatingEvents();
    }

    return this._events;
  }
  private generateNonRepeatingEvents(): void {
    const events = this._events;
    const eventDate = new Date(this._template.start);
    const eventEnd = new Date(
      eventDate.getTime() + this._template.type.duration
    );

    const isWithinSpan = doRangesIntersect(
      eventDate.getTime(),
      eventEnd.getTime(),
      this._startDate.getTime(),
      this._endDate.getTime()
    );

    if (isWithinSpan) {
      if (this._template.type.isAllDay) {
        eventDate.setHours(0, 0, 0, 0);
        eventEnd.setHours(23, 59, 59, 999);
      } else {
        eventDate.setHours(this._template.type.hour);
        eventDate.setMinutes(this._template.type.minute);

        eventEnd.setMilliseconds(
          eventDate.getMilliseconds() + this._template.type.duration
        );
      }

      const event: Event<Daily> = {
        template: this._template,
        startTimestamp: eventDate.getTime(),
        endTimestamp: eventEnd.getTime(),
      };

      events.push(event);
    }
  }

  private getEndTime() {
    if (this._template.end == null) {
      return this._endDate.getTime();
    } else {
      return Math.min(this._endDate.getTime(), this._template.end);
    }
  }

  private generateRepeatingEvents(): void {
    const events = this._events;
    const eventDate = new Date(this._template.start);
    const end = this.getEndTime();
    const daysSinceStart = Math.floor(
      (this._startDate.getTime() - eventDate.getTime()) / DAY_IN_MILLISECONDS
    );

    let daysToNextEvent = daysSinceStart % this._template.type.repeatEvery;
    if (daysToNextEvent !== 0) {
      daysToNextEvent = this._template.type.repeatEvery - daysToNextEvent;
    }

    if (this._template.type.isAllDay) {
      eventDate.setHours(0, 0, 0, 0);
    } else {
      eventDate.setHours(this._template.type.hour);
      eventDate.setMinutes(this._template.type.minute);
      eventDate.setSeconds(0);
      eventDate.setMilliseconds(0);
    }

    while (eventDate.getTime() < end) {
      let eventEnd = new Date(eventDate);

      if (this._template.type.isAllDay) {
        eventEnd.setHours(23, 59, 59, 999);
      } else {
        eventEnd = new Date(eventDate.getTime() + this._template.type.duration);
      }

      const isWithinRange = doRangesIntersect(
        eventDate.getTime(),
        eventEnd.getTime(),
        this._startDate.getTime(),
        this._endDate.getTime()
      );

      if (isWithinRange) {
        const event: Event<Daily> = {
          template: this._template,
          startTimestamp: eventDate.getTime(),
          endTimestamp: eventEnd.getTime(),
        };

        events.push(event);
      }

      eventDate.setDate(eventDate.getDate() + this._template.type.repeatEvery);
    }
  }
}
