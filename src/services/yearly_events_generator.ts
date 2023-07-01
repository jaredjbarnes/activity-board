import { EventTemplate } from "src/models/event_template.ts";
import { Event } from "src/models/event.ts";
import { Yearly } from "src/models/event_template_types/yearly.ts";
import { doRangesIntersect } from "src/services/do_ranges_intersect.ts";

export class YearlyEventsGenerator {
  private _template!: EventTemplate<Yearly>;
  private _events: Event<Yearly>[] = [];
  private _startDate!: Date;
  private _endDate!: Date;

  generate(
    template: EventTemplate<Yearly>,
    startDate: Date,
    endDate: Date
  ): Event<Yearly>[] {
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
    eventDate.setMonth(this._template.type.month);
    eventDate.setDate(this._template.type.day);
    eventDate.setHours(this._template.type.hour);
    eventDate.setMinutes(this._template.type.minute);

    const eventEnd = eventDate.getTime() + this._template.type.duration;

    const isWithinRange = doRangesIntersect(
      eventDate.getTime(),
      eventEnd,
      this._startDate.getTime(),
      this._endDate.getTime()
    );

    if (isWithinRange) {
      const event: Event<Yearly> = {
        template: this._template,
        startTimestamp: eventDate.getTime(),
        endTimestamp: eventEnd,
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

  private getStartTime() {
    return Math.max(this._startDate.getTime(), this._template.start);
  }

  private generateRepeatingEvents(): void {
    const events = this._events;
    const endDate = new Date(this.getEndTime());
    const startDate = new Date(this.getStartTime());
    const start = startDate.getTime();
    const end = endDate.getTime();

    let currentDate = new Date(this._startDate.getTime());

    while (currentDate.getFullYear() <= endDate.getFullYear()) {
      const currentYear = currentDate.getFullYear();
      const eventYear = new Date(this._template.start).getFullYear();

      // Check if the current year is a repeat year
      if ((currentYear - eventYear) % this._template.type.repeatEvery === 0) {
        const eventDate = new Date(currentDate);
        eventDate.setMonth(this._template.type.month);
        eventDate.setDate(this._template.type.day);
        eventDate.setHours(this._template.type.hour);
        eventDate.setMinutes(this._template.type.minute);

        const eventStart = eventDate.getTime();
        const eventEnd = eventStart + this._template.type.duration;

        const isWithinRange = doRangesIntersect(
          eventStart,
          eventEnd,
          start,
          end
        );

        if (isWithinRange) {
          const event: Event<Yearly> = {
            template: this._template,
            startTimestamp: eventDate.getTime(),
            endTimestamp: eventEnd,
          };
          events.push(event);
        }
      }

      // Increment the year
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    }
  }
}
