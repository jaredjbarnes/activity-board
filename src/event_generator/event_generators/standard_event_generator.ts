import { IGeneratedEvent } from "src/event_generator/models/i_generated_event.ts";
import { IEventTemplate } from "src/event_generator/models/i_event_template.ts";
import { IStandardEventType } from "src/event_generator/models/event_template_types/i_standard_event_type.ts";
import { EventGenerator } from "src/event_generator/event_generators/event_generator.ts";

export class StandardEventGenerator
  implements EventGenerator<IStandardEventType>
{
  generate(
    template: IEventTemplate<IStandardEventType>,
    startDate: Date,
    endDate: Date,
  ): IGeneratedEvent<IStandardEventType>[] {
    let events: IGeneratedEvent<IStandardEventType>[] = [];

    const eventEndTime = template.eventType.startOn + template.eventType.duration;

    // Check if event date intersects with the range [startDate, endDate]
    if (
      this.intersects(
        template.eventType.startOn,
        eventEndTime,
        startDate.getTime(),
        endDate.getTime()
      )
    ) {
      const event: IGeneratedEvent<IStandardEventType> = {
        template: template,
        startTimestamp: template.eventType.startOn,
        endTimestamp: eventEndTime,
        generatedTimestamp: template.eventType.startOn,
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
