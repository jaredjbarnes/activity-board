import { EventTemplate } from "src/models/event_template.ts";
import { Event } from "src/models/event.ts";
import { FirstDayOfMonth } from "src/models/event_template_types/first_day_of_month.ts";
import { doRangesIntersect } from "src/services/do_ranges_intersect.ts";

export class FirstDayOfMonthEventsGenerator {
  private _template!: EventTemplate<FirstDayOfMonth>;
  private _startDate!: Date;
  private _endDate!: Date;
  private _events!: Event<FirstDayOfMonth>[];

  generate(
    template: EventTemplate<FirstDayOfMonth>,
    startDate: Date,
    endDate: Date
  ): Event<FirstDayOfMonth>[] {
    this._template = template;
    this._startDate = startDate;
    this._endDate = endDate;
    this._events = [];

    const isDeleted = this._template.deletedOn != null;

    if (isDeleted) {
      return this._events;
    }

    this.generateEvents();

    return this._events;
  }

  private generateEvents(): void {
    const start = this.getStartTime();
    let currentMonth = new Date(start.getFullYear(), start.getMonth(), 1);

    while (currentMonth.getTime() <= this._endDate.getTime()) {
      const eventStart = currentMonth.getTime();
      const eventEnd = eventStart + this._template.type.duration;
      
      const isWithinRange = doRangesIntersect(
        eventStart,
        eventEnd,
        this._startDate.getTime(),
        this._endDate.getTime()
      );

      if (isWithinRange) {
        this._events.push(this.createEvent(new Date(eventStart)));
      }

      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    }
  }

  private getStartTime(): Date {
    if (this._template.start > this._startDate.getTime()) {
      return new Date(this._template.start);
    } else {
      return this._startDate;
    }
  }

  private createEvent(eventDate: Date): Event<FirstDayOfMonth> {
    if (!this._template.type.isAllDay) {
      eventDate.setHours(this._template.type.hour);
      eventDate.setMinutes(this._template.type.minute);
    }

    return {
      template: this._template,
      startTimestamp: eventDate.getTime(),
      endTimestamp: eventDate.getTime() + this._template.type.duration,
    };
  }
}
