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

export class WeeklyEventGenerator
  implements EventGenerator<IWeeklyRecurringEventType>
{
  generate(
    template: IEventTemplate<IWeeklyRecurringEventType>,
    startDate: Date,
    endDate: Date
  ): IEvent<IWeeklyRecurringEventType>[] {
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

    const events: IEvent<IWeeklyRecurringEventType>[] = [];

    if (template.eventType.name !== EventTypeName.Weekly) {
      return events;
    }

    const weeklyTemplate = template.eventType as IWeeklyRecurringEventType;

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
          events.push({
            template: template,
            startTimestamp: eventStart,
            endTimestamp: eventEnd,
          });
        }
      }

      // Skip to the start of the same day in the next week
      current.setDate(current.getDate() + 7 * weeklyTemplate.repeatInterval);
    }

    return events;
  }

  private intersects(
    startA: number,
    endA: number,
    startB: number,
    endB: number
  ): boolean {
    return Math.max(startA, startB) <= Math.min(endA, endB);
  }
}
