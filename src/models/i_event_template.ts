import { IEventType } from "src/models/i_event_type.ts";

export interface IEventTemplate {
  id: string;
  title: string;
  notes: string | null;
  eventType: IEventType;
}










