import { EventTemplateType } from "src/models/event_template_type.ts";
import { TemplateName } from "src/models/event_template_types/template_name.ts";

export interface Yearly extends EventTemplateType {
  name: TemplateName.YEARLY
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  duration: number;
  repeatEvery: number; 
}