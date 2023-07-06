import { IEventType } from "src/models/i_event_type.ts";

// Base event template interface
export interface IEventTemplate {
  id: string;
  title: string;
  description?: string;
  location?: string;
  eventType: IEventType;
}










