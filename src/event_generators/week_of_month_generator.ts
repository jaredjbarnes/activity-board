import { IWeekOfMonthEventType } from "src/models/event_template_types/i_week_of_month_event_type.ts";
import { EventTypeName } from "src/models/event_template_types/event_type_name.ts";
import { IEvent } from "src/models/i_event.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { EventGenerator } from "src/event_generators/event_generator.ts";

export class WeekOfMonthEventGenerator
  implements EventGenerator<IWeekOfMonthEventType>
{
  generate(
    template: IEventTemplate<IWeekOfMonthEventType>,
    startDate: Date,
    endDate: Date
  ): IEvent<IWeekOfMonthEventType>[] {
    let events: IEvent<IWeekOfMonthEventType>[] = [];

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

    if (template.eventType.name === EventTypeName.WeekOfMonth) {
      const eventType = template.eventType;

      // iterate over each month
      for (
        let d = new Date(startDate.getTime());
        d <= endDate;
        d.setMonth(d.getMonth() + 1)
      ) {
        // iterate over each repeat day
        for (let repeatDay of eventType.repeatOnDays) {
          let targetDate: Date;

          if (eventType.repeatOnWeek < 0) {
            let lastDateOfMonth = new Date(
              d.getFullYear(),
              d.getMonth() + 1,
              0
            );
            targetDate = this.findTargetDateFromEndOfMonth(
              lastDateOfMonth,
              repeatDay,
              eventType.repeatOnWeek
            );
          } else {
            let firstDateOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
            targetDate = this.findTargetDateFromStartOfMonth(
              firstDateOfMonth,
              repeatDay,
              eventType.repeatOnWeek
            );
          }

          const eventStart = targetDate.getTime();
          const eventEnd = eventStart + eventType.duration;

          if (
            this.intersects(
              startDate.getTime(),
              endDate.getTime(),
              eventStart,
              eventEnd
            )
          ) {
            const startTimestamp = eventStart + eventType.startTime;
            const endTimestamp = startTimestamp + eventType.duration;

            events.push({
              template: template,
              startTimestamp: startTimestamp,
              endTimestamp: endTimestamp,
              generatedTimestamp: eventStart,
            });
          }
        }
      }
    }

    return events;
  }

  private findTargetDateFromEndOfMonth(
    endOfMonth: Date,
    repeatDay: number,
    repeatWeek: number
  ): Date {
    const date = new Date(endOfMonth);
    // Calculate the difference between the repeatDay and the day of the week of the last day of the month
    let dayDiff = date.getDay() - repeatDay;
    if (dayDiff < 0) dayDiff += 7;

    // Subtract the difference in days to get the latest repeatDay in the month
    date.setDate(date.getDate() - dayDiff);

    // If repeatWeek is negative, calculate the week of the month of the current date
    date.setDate(date.getDate() + 7 * (repeatWeek + 1));

    return date;
  }

  private findTargetDateFromStartOfMonth(
    startOfMonth: Date,
    repeatDay: number,
    repeatWeek: number
  ): Date {
    // Get the first day of the month
    let date = new Date(startOfMonth);

    // Calculate the difference between the repeatDay and the day of the week of the first day of the month
    let dayDiff = repeatDay - date.getDay();
    if (dayDiff < 0) dayDiff += 7;

    // Add the difference in days to get the first occurrence of repeatDay in the month
    date.setDate(date.getDate() + dayDiff);

    // If repeatWeek is more than 1, move forward to the desired week
    if (repeatWeek > 1) {
      date.setDate(date.getDate() + 7 * (repeatWeek - 1));
    }

    return date;
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
