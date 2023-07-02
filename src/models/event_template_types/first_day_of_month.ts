import { EventTemplateType } from "src/models/event_template_type.ts";
import { TemplateName } from "src/models/event_template_types/template_name.ts";

export interface FirstDayOfMonth extends EventTemplateType {
  name: TemplateName.FIRST_DAY_OF_MONTH,
  hour: number;
  minute: number;
  duration: number;
  isAllDay: boolean;
}
