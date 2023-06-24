import { EventTemplate } from "src/models/event_template.ts";
import { Event } from "src/models/event.ts";
import { Day } from "src/models/event_template_types/day.ts";

export class DayEventsGenerator {
  private _template!: EventTemplate<Day>;
  private _events: Event<Day>[] = [];
  private _startDate!: Date;
  private _endDate!: Date;

  generate(
    template: EventTemplate<Day>,
    startDate: Date,
    endDate: Date
  ): Event<Day>[] {
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
    eventDate.setMonth(this._template.type.month);
    eventDate.setDate(this._template.type.day);
    eventDate.setHours(this._template.type.hour);
    eventDate.setMinutes(this._template.type.minute);

    if (eventDate.getTime() >= this._startDate.getTime() && eventDate.getTime() < this._endDate.getTime()) {
      const event: Event<Day> = {
        template: this._template,
        startTimestamp: eventDate.getTime(),
        endTimestamp: eventDate.getTime() + this._template.type.duration,
      };
      events.push(event);
    }
  }

  private generateRepeatingEvents(): void {
    const events = this._events;
    const eventDate = new Date(this._template.startOn);
    eventDate.setMonth(this._template.type.month);
    eventDate.setDate(this._template.type.day);
    eventDate.setHours(this._template.type.hour);
    eventDate.setMinutes(this._template.type.minute);

    let yearsSinceStart = this._startDate.getFullYear() - eventDate.getFullYear();

    // If the current year is a repeat year, calculate the event date for this year
    if (yearsSinceStart % this._template.type.repeatEvery === 0) {
      eventDate.setFullYear(this._startDate.getFullYear());

      if (eventDate.getTime() >= this._startDate.getTime() && eventDate.getTime() < this._endDate.getTime()) {
        const event: Event<Day> = {
          template: this._template,
          startTimestamp: eventDate.getTime(),
          endTimestamp: eventDate.getTime() + this._template.type.duration,
        };
        events.push(event);
      }
    }
  }
}
