import { EventTemplateType } from "src/models/event_template_type";

export interface Daily extends EventTemplateType {
  name: "daily";
  hour: number;
  minute: number;
  duration: number;
  repeatEvery: number;
  isAllDay: boolean;
}