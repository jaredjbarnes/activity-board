import { EventTemplate } from "src/models/event_template.ts";
import { EventTemplateType } from "src/models/event_template_type.ts";
import { EventTemplateTypesPort } from "src/services/event_template_types_port.ts";
import { WeakPromise } from "@m/hex/weak_promise";

export class InMemoryEventTemplateAdapter<T extends EventTemplateType> implements EventTemplateTypesPort<T> {
  private events: EventTemplate<T>[] = [];

  getEvents(): WeakPromise<EventTemplate<T>[]> {
    return WeakPromise.resolve([...this.events]);
  }

  saveEvent(template: EventTemplate<T>): WeakPromise<EventTemplate<T>> {
    const index = this.events.findIndex(event => event.id === template.id);
    if (index >= 0) {
      this.events[index] = template;
    } else {
      this.events.push(template);
    }
    return WeakPromise.resolve(template);
  }

  deleteEvent(template: EventTemplate<T>): WeakPromise<void> {
    this.events = this.events.filter(event => event.id !== template.id);
    return WeakPromise.resolve();
  }
}
