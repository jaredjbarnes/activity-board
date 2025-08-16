import { IEventType } from "src/event_generator/models/i_event_type.ts";

export interface IEventTemplate<T extends IEventType> {
  id: string;
  title: string;
  notes: string | null;
  eventType: T;
}