import { EventTemplate } from "src/models/event_template.ts";
import { Event } from "src/models/event.ts";
import { Weekly } from "src/models/event_template_types/weekly.ts";
import { doRangesIntersect } from "src/services/do_ranges_intersect.ts";

const WEEK_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;

export class WeeklyEventsGenerator {
  private _template!: EventTemplate<Weekly>;
  private _startDate!: Date;
  private _endDate!: Date;
  private _events!: Event<Weekly>[];

  generate(
    template: EventTemplate<Weekly>,
    startDate: Date,
    endDate: Date
  ): Event<Weekly>[] {
    this._template = template;
    let eventDate = new Date(template.start);
    this._startDate = startDate;
    this._endDate = endDate;
    this._events = [];

    const isDeleted = this._template.deletedOn != null;

    if (isDeleted) {
      return this._events;
    }

    if (this._template.type.repeatEvery === 0) {
      this.generateNonRepeating(eventDate);
    } else {
      this.generateRepeating(eventDate);
    }

    return this._events;
  }

  private generateNonRepeating(eventDate: Date): void {
    const endEvent = eventDate.getTime() + this._template.type.duration;

    const isWithinRange = doRangesIntersect(
      eventDate.getTime(),
      endEvent,
      this._startDate.getTime(),
      this._endDate.getTime()
    );

    if (isWithinRange) {
      this._events.push(this.createEvent(eventDate));
    }
  }

  private getEndTime() {
    if (this._template.end == null) {
      return this._endDate.getTime();
    } else {
      return Math.min(this._endDate.getTime(), this._template.end);
    }
  }

  private generateRepeating(eventDate: Date): void {
    const end = this.getEndTime();
    const weeksSinceStart = Math.floor(
      (this._startDate.getTime() - eventDate.getTime()) / WEEK_IN_MILLISECONDS
    );

    let daysToNextEvent =
      (7 + this._template.type.dayOfWeek - eventDate.getDay()) % 7;

    if (weeksSinceStart % this._template.type.repeatEvery !== 0) {
      daysToNextEvent +=
        Math.floor(weeksSinceStart / this._template.type.repeatEvery) *
        this._template.type.repeatEvery *
        7;
    }

    eventDate.setDate(eventDate.getDate() + daysToNextEvent);

    while (eventDate.getTime() < end) {
      const endEvent = eventDate.getTime() + this._template.type.duration;

      const isWithinRange = doRangesIntersect(
        eventDate.getTime(),
        endEvent,
        this._startDate.getTime(),
        this._endDate.getTime()
      );

      if (isWithinRange) {
        this._events.push(this.createEvent(eventDate));
      }

      eventDate.setDate(
        eventDate.getDate() + this._template.type.repeatEvery * 7
      );
    }
  }

  private createEvent(eventDate: Date): Event<Weekly> {
    eventDate.setHours(this._template.type.hour);
    eventDate.setMinutes(this._template.type.minute);

    return {
      template: this._template,
      startTimestamp: eventDate.getTime(),
      endTimestamp: eventDate.getTime() + this._template.type.duration,
    };
  }
}
