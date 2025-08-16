import { IGeneratedEvent } from "src/models/i_generated_event.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { IEventType } from "src/models/i_event_type.ts";
import { IEventAlteration, EventAlterationType } from "src/models/event_template_types/i_event_alteration.ts";

export class AlterationEventGenerator {
  private alterations: IEventAlteration[] = [];
  private templates: Map<string, IEventTemplate<IEventType>>;

  constructor(templates: Map<string, IEventTemplate<IEventType>>) {
    this.templates = templates;
  }

  setAlterations(alterations: IEventAlteration[]): void {
    this.alterations = alterations;
  }

  generate(startDate: Date, endDate: Date): IGeneratedEvent<IEventType>[] {
    let events: IGeneratedEvent<IEventType>[] = [];

    // Filter alterations that are within the date range
    const relevantAlterations = this.alterations.filter(alteration => 
      this.intersects(
        alteration.startTimestamp,
        alteration.startTimestamp + alteration.duration,
        startDate.getTime(),
        endDate.getTime()
      )
    );

    // Process each relevant alteration
    for (const alteration of relevantAlterations) {
      if (alteration.type === EventAlterationType.Reschedule) {
        // Look up the original template
        const template = this.templates.get(alteration.templateId);
        
        // Only generate event if we can find the template
        if (template) {
          const event: IGeneratedEvent<IEventType> = {
            template: template,
            startTimestamp: alteration.startTimestamp,
            endTimestamp: alteration.startTimestamp + alteration.duration,
            generatedTimestamp: alteration.generatedEventTimestamp,
          };
          events.push(event);
        }
      }
      // Note: Cancelled events are not included in the generated events
      // as they represent events that should not occur
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
