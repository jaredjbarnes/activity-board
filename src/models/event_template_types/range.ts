import { EventTemplateType } from "src/models/event_template_type.ts";

export interface Range extends EventTemplateType {
  startTimestamp: number;
  endTimestamp: number;
}