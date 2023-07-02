import { EventTemplate } from "src/models/event_template.ts";
import { Event } from "src/models/event.ts";
import { FirstDayOfWeek } from "src/models/event_template_types/first_day_of_week.ts";
import { doRangesIntersect } from "src/services/do_ranges_intersect.ts";
import { EventGenerator } from "src/services/event_generator.ts";

export class FirstDayOfWeekEventsGenerator
  implements EventGenerator<FirstDayOfWeek>
{
  private _template!: EventTemplate<FirstDayOfWeek>;
  private _startDate!: Date;
  private _endDate!: Date;
  private _events!: Event<FirstDayOfWeek>[];

  generate(
    template: EventTemplate<FirstDayOfWeek>,
    startDate: Date,
    endDate: Date
  ): Event<FirstDayOfWeek>[] {
    this._template = template;
    this._startDate = startDate;
    this._endDate = endDate;
    this._events = [];

    const isDeleted = this._template.deletedOn != null;

    if (!isDeleted) {
      this.generateEvents();
    }

    return this._events;
  }

  private getStartTime(): number {
    return Math.max(this._startDate.getTime(), this._template.start);
  }

  private getEndTime(): number {
    if (this._template.end == null) {
      return this._endDate.getTime();
    } else {
      return Math.min(this._endDate.getTime(), this._template.end);
    }
  }

  private generateEvents(): void {
    let eventDate = new Date(this.getStartTime());
    const end = this.getEndTime();

    while (eventDate.getTime() < end) {
      const weekNumber = Math.floor((eventDate.getDate() - 1) / 7) + 1;

      // Check if eventDate is in the first week of the month and is the selected day of the week
      if (
        weekNumber === 1 &&
        eventDate.getDay() === this._template.type.daysOfWeek
      ) {
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

      // Go to the next day
      eventDate.setDate(eventDate.getDate() + 1);
    }
  }

  private createEvent(eventDate: Date): Event<FirstDayOfWeek> {
    eventDate.setHours(this._template.type.hour);
    eventDate.setMinutes(this._template.type.minute);

    return {
      template: this._template,
      startTimestamp: eventDate.getTime(),
      endTimestamp: eventDate.getTime() + this._template.type.duration,
    };
  }
}
