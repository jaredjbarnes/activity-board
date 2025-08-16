import { IDaysOfWeekEventType } from "src/event_generator/models/event_template_types/i_days_of_week_event_type.ts";
import { EventTypeName } from "src/event_generator/models/event_template_types/event_type_name.ts";
import { IGeneratedEvent } from "src/event_generator/models/i_generated_event.ts";
import { IEventTemplate } from "src/event_generator/models/i_event_template.ts";
import { EventGenerator } from "src/event_generator/event_generators/event_generator.ts";
import { IEventAlteration, EventAlterationType } from "src/event_generator/models/event_template_types/i_event_alteration.ts";

// Utility function to check intersection of two date ranges
function intersects(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

export class DaysOfWeekGenerator
  implements EventGenerator<IDaysOfWeekEventType>
{
  generate(
    template: IEventTemplate<IDaysOfWeekEventType>,
    startDate: Date,
    endDate: Date,
    alterations: Map<number, IEventAlteration[]>
  ): IGeneratedEvent<IDaysOfWeekEventType>[] {
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

    const events: IGeneratedEvent<IDaysOfWeekEventType>[] = [];

    if (template.eventType.name !== EventTypeName.DayOfWeek) {
      return events;
    }

    const weeklyTemplate = template.eventType as IDaysOfWeekEventType;

    const current = new Date(
      Math.max(startDate.getTime(), weeklyTemplate.startOn)
    );
    current.setHours(0, 0, 0, 0);
    const startTimestamp = new Date(current).getTime();
    const end = new Date(
      Math.min(endDate.getTime(), weeklyTemplate.endOn || Infinity)
    );
    const endTimestamp = end.getTime();

    // Find the first recurring day of the week.
    const minimumDay = Math.min(...weeklyTemplate.repeatOnDays);
    const diff = current.getDay() - minimumDay;

    if (diff > 0) {
      current.setDate(current.getDate() + 7 - diff);
    } else if (diff < 0) {
      current.setDate(current.getDate() - current.getDay() + minimumDay);
    }

    while (current.getTime() <= end.getTime()) {
      // Iterate over each day in the week
      for (const day of weeklyTemplate.repeatOnDays) {
        const eventDate = new Date(current.getTime());
        eventDate.setDate(eventDate.getDate() - eventDate.getDay() + day);
        const eventStart = eventDate.getTime() + weeklyTemplate.startTime;
        const eventEnd =
          eventDate.getTime() +
          weeklyTemplate.startTime +
          weeklyTemplate.duration;

        if (intersects(eventStart, eventEnd, startTimestamp, endTimestamp)) {
          // Check if this event has any alterations that would prevent it from being generated
          const eventAlterations = alterations.get(eventStart) || [];
          const hasAlteration = eventAlterations.some((alteration: IEventAlteration) => 
            alteration.templateId === template.id
          );

          // Only generate the event if there are no alterations for it
          if (!hasAlteration) {
            events.push({
              template: template,
              startTimestamp: eventStart,
              endTimestamp: eventEnd,
              generatedTimestamp: eventStart,
            });
          }
        }
      }

      // Skip to the start of the same day in the next week
      current.setDate(current.getDate() + 7 * weeklyTemplate.repeatIntervalByWeek);
    }

    return events;
  }

  private intersects(
    startA: number,
    endA: number,
    startB: number,
    endB: number
  ): boolean {
    return Math.max(startA, startB) < Math.min(endA, endB);
  }
}
