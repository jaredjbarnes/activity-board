import { EventTemplateType } from "src/models/event_template_type.ts";
import { TemplateName } from "src/models/event_template_types/template_name.ts";

export interface Daily extends EventTemplateType {
  name: TemplateName.DAILY,
  hour: number;
  minute: number;
  duration: number;
  repeatEvery: number;
  isAllDay: boolean;
}