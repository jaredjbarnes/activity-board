import { IEventTemplate } from "src/models/i_event_template.ts";

export interface IEvent{
  template: IEventTemplate;
  startTimestamp: number;
  endTimestamp: number;
} 