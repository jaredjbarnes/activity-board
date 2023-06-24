import { EventTemplate } from "src/models/event_template.ts";
import { Event } from "src/models/event.ts";
import { Daily } from "src/models/event_template_types/daily.ts";

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

    if (this._template.deletedOn != null) {
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
    const eventDate = new Date(this._template.startOn);
    const eventEnd = new Date(eventDate);
    const isWithinSpan =
      eventDate.getTime() >= this._startDate.getTime() &&
      eventDate.getTime() < this._endDate.getTime();

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

  private generateRepeatingEvents(): void {
    const events = this._events;
    const eventDate = new Date(this._template.startOn);
    const daysSinceStart = Math.floor(
      (this._startDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    let daysToNextEvent = daysSinceStart % this._template.type.repeatEvery;
    if (daysToNextEvent !== 0) {
      daysToNextEvent = this._template.type.repeatEvery - daysToNextEvent;
    }

    eventDate.setDate(eventDate.getDate() + daysToNextEvent);
    eventDate.setHours(this._template.type.hour);
    eventDate.setMinutes(this._template.type.minute);

    while (eventDate.getTime() < this._endDate.getTime()) {
      const event: Event<Daily> = {
        template: this._template,
        startTimestamp: eventDate.getTime(),
        endTimestamp: eventDate.getTime() + this._template.type.duration,
      };
      events.push(event);

      eventDate.setDate(eventDate.getDate() + this._template.type.repeatEvery);
    }
  }
}