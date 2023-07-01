import { EventTemplate } from "src/models/event_template.ts";
import { EventTemplateType } from "src/models/event_template_type.ts";
import { EventTemplateTypesPort } from "src/services/event_template_types_port.ts";
import { WeakPromise } from "@m/hex/weak_promise";

function intersects(
  start1: number,
  end1: number,
  start2: number,
  end2: number
) {
  return Math.max(start1, start2) < Math.min(end1, end2);
}

export class InMemoryEventTemplateAdapter<T extends EventTemplateType>
  implements EventTemplateTypesPort<T>
{
  private events: EventTemplate<T>[] = [];

  getEvents(startDate: Date, endDate: Date): WeakPromise<EventTemplate<T>[]> {
    const start = startDate.getTime();
    const end = endDate.getTime();

    const results = this.events.filter((event) => {
      return intersects(event.start, event.end || Infinity, start, end);
    });

    return WeakPromise.resolve(results);
  }

  saveEvent(template: EventTemplate<T>): WeakPromise<EventTemplate<T>> {
    const index = this.events.findIndex((event) => event.id === template.id);
    if (index >= 0) {
      this.events[index] = template;
    } else {
      this.events.push(template);
    }
    return WeakPromise.resolve(template);
  }

  deleteEvent(template: EventTemplate<T>): WeakPromise<void> {
    this.events = this.events.filter((event) => event.id !== template.id);
    return WeakPromise.resolve();
  }
}
