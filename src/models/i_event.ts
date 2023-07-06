import { IEventTemplate } from "src/models/i_event_template.ts";

export interface Event{
  template: IEventTemplate;
  startTimestamp: number;
  endTimestamp: number;
} 