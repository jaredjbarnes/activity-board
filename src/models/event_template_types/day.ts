import { EventTemplateType } from "src/models/event_template_type";

export interface Day extends EventTemplateType {
  name: "day";
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  duration: number;
  repeatEvery: number; 
}