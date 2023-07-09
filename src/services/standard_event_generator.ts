import { IEvent } from "src/models/i_event.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { IStandardEventType } from "src/models/event_template_types/i_standard_event_type.ts";
import { EventGenerator } from "src/services/event_generator.ts";

export class StandardEventGenerator
  implements EventGenerator<IStandardEventType>
{
  generate(
    template: IEventTemplate<IStandardEventType>,
    startDate: Date,
    endDate: Date
  ): IEvent<IStandardEventType>[] {
    let events: IEvent<IStandardEventType>[] = [];

    // Check if event date intersects with the range [startDate, endDate]
    if (
      this.intersects(
        template.eventType.startOn,
        template.eventType.endOn,
        startDate.getTime(),
        endDate.getTime()
      )
    ) {
      const event: IEvent<IStandardEventType> = {
        template: template,
        startTimestamp: template.eventType.startOn,
        endTimestamp: template.eventType.endOn,
      };
      events.push(event);
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
