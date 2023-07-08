import { IWeeklyRecurringEventType } from "src/models/event_template_types/i_weekly_recurring_event_type.ts";
import { EventTypeName } from "src/models/event_type_name.ts";
import { IEvent } from "src/models/i_event.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { EventGenerator } from "src/services/event_generator.ts";

// Utility function to check intersection of two date ranges
function intersects(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

export class WeeklyEventGenerator implements EventGenerator {
  generate(template: IEventTemplate, startDate: Date, endDate: Date): IEvent[] {
    const events: IEvent[] = [];

    if (template.eventType.name !== EventTypeName.Weekly) {
      return events;
    }

    const weeklyTemplate = template.eventType as IWeeklyRecurringEventType;

    const current = new Date(
      Math.max(startDate.getTime(), weeklyTemplate.startOn)
    );
    current.setHours(0, 0, 0, 0);
    const end = new Date(
      Math.min(endDate.getTime(), weeklyTemplate.endOn || Infinity)
    );

    // Round the start date down to the start of the current week
    if (current.getDay() !== 1) {
      current.setDate(current.getDate() - (current.getDay() - 1));
    }

    while (current.getTime() <= end.getTime()) {
      // Iterate over each day in the week
      for (const day of weeklyTemplate.repeatOnDays) {
        const eventDate = new Date(current.getTime());
        eventDate.setDate(eventDate.getDate() + (day - 1)); // `Days` are 1-indexed, while `getDay` is 0-indexed
        const eventStart = eventDate.getTime() + weeklyTemplate.startTime;
        
        // Make sure we are within bounds.
        if (eventStart >= end.getTime()){
          break;
        }

        const eventEnd =
          eventDate.getTime() +
          weeklyTemplate.startTime +
          weeklyTemplate.duration;

        events.push({
          template: template,
          startTimestamp: eventStart,
          endTimestamp: eventEnd,
        });
      }

      // Skip to the start of the same day in the next week
      current.setDate(current.getDate() + 7 * weeklyTemplate.repeatInterval);
    }

    return events;
  }
}
