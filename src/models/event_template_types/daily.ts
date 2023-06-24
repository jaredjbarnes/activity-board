import { EventTemplateType } from "src/models/event_template_type.ts";

export interface Daily extends EventTemplateType {
  hour: number;
  minute: number;
  duration: number;
  repeatEvery: number;
  isAllDay: boolean;
}