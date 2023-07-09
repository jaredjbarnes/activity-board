import { IEventType } from "src/models/i_event_type.ts";

export interface IEventTemplate<T extends IEventType> {
  id: string;
  title: string;
  notes: string | null;
  eventType: T;
}