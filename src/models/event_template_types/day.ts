import { EventTemplateType } from "src/models/event_template_type.ts";

export interface Day extends EventTemplateType {
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  duration: number;
  repeatEvery: number; 
}