import { IGeneratedEvent } from "src/models/i_generated_event.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { IEventType } from "src/models/i_event_type.ts";
import { IEventAlteration } from "src/models/event_template_types/i_event_alteration.ts";

export interface EventGenerator<T extends IEventType> {
  generate(
    template: IEventTemplate<T>, 
    startDate: Date, 
    endDate: Date, 
    alterations: Map<number, IEventAlteration[]>
  ): IGeneratedEvent<T>[];
}
