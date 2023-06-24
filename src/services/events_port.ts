import { WeakPromise } from "@m/hex/weak_promise";
import { EventTemplate } from "src/models/event_template";
import { EventTemplateType } from "src/models/event_template_type";

export interface EventsPort<T extends EventTemplateType> {
  getEvents(): WeakPromise<EventTemplate<T>[]>;
  saveEvent(template: EventTemplate<T>): WeakPromise<EventTemplate<T>>;
  deleteEvent(template: EventTemplate<T>): WeakPromise<void>;
}