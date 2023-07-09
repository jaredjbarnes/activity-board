import { IEvent } from "src/models/i_event.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { IYearlyRecurringEventType } from "src/models/event_template_types/i_yearly_recurring_event_type.ts";
import { EventGenerator } from "src/services/event_generator.ts";

export class YearlyEventGenerator
  implements EventGenerator<IYearlyRecurringEventType>
{
  generate(
    template: IEventTemplate<IYearlyRecurringEventType>,
    startDate: Date,
    endDate: Date
  ): IEvent<IYearlyRecurringEventType>[] {
    let events: IEvent<IYearlyRecurringEventType>[] = [];
    let currentYear = startDate.getFullYear();

    // Quickly get out if there isn't an intersection.
    if (
      !this.intersects(
        startDate.getTime(),
        endDate.getTime(),
        template.eventType.startOn,
        template.eventType.endOn || Infinity
      )
    ) {
      return [];
    }

    while (currentYear <= endDate.getFullYear()) {
      let eventDate = new Date(
        currentYear,
        template.eventType.repeatOnMonth,
        template.eventType.repeatOnDay
      );

      // Ensure date is valid (needed for February 29 on non-leap years)
      if (eventDate.getMonth() !== template.eventType.repeatOnMonth) {
        eventDate.setDate(0); // Roll back to last day of previous month
      }

      const startTimestamp = eventDate.getTime() + template.eventType.startTime;
      const endTimestamp = startTimestamp + template.eventType.duration;

      // Check if event date intersects with the range [startDate, endDate]
      if (
        this.intersects(
          startTimestamp,
          endTimestamp,
          startDate.getTime(),
          endDate.getTime()
        )
      ) {
        const event: IEvent<IYearlyRecurringEventType> = {
          template: template,
          startTimestamp: startTimestamp,
          endTimestamp: endTimestamp,
        };
        events.push(event);
      }
      currentYear++;
    }
    return events;
  }

  intersects(
    startA: number,
    endA: number,
    startB: number,
    endB: number
  ): boolean {
    return Math.max(startA, startB) <= Math.min(endA, endB);
  }
}
