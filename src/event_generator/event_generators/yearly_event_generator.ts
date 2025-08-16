import { IGeneratedEvent } from "src/event_generator/models/i_generated_event.ts";
import { IEventTemplate } from "src/event_generator/models/i_event_template.ts";
import { IYearlyRecurringEventType } from "src/event_generator/models/event_template_types/i_yearly_event_type.ts";
import { EventGenerator } from "src/event_generator/event_generators/event_generator.ts";
import { IEventAlteration } from "src/event_generator/models/event_template_types/i_event_alteration.ts";

export class YearlyEventGenerator
  implements EventGenerator<IYearlyRecurringEventType>
{
  generate(
    template: IEventTemplate<IYearlyRecurringEventType>,
    startDate: Date,
    endDate: Date,
    alterations: Map<number, IEventAlteration[]>
  ): IGeneratedEvent<IYearlyRecurringEventType>[] {
    let events: IGeneratedEvent<IYearlyRecurringEventType>[] = [];
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
        // Check if this event has any alterations that would prevent it from being generated
        const eventAlterations = alterations.get(startTimestamp) || [];
        const hasAlteration = eventAlterations.some((alteration: IEventAlteration) => 
          alteration.templateId === template.id
        );

        // Only generate the event if there are no alterations for it
        if (!hasAlteration) {
          const event: IGeneratedEvent<IYearlyRecurringEventType> = {
            template: template,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            generatedTimestamp: startTimestamp,
          };
          events.push(event);
        }
      }
      currentYear += template.eventType.repeatIntervalByYear;
    }
    return events;
  }

  intersects(
    startA: number,
    endA: number,
    startB: number,
    endB: number
  ): boolean {
    return Math.max(startA, startB) < Math.min(endA, endB);
  }
}
