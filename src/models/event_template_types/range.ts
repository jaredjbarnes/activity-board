import { EventTemplateType } from "src/models/event_template_type";

export interface Range extends EventTemplateType {
  name: "range";
  startTimestamp: number;
  endTimestamp: number;
}