import { EventTemplate } from "src/models/event_template.ts";
import { Event } from "src/models/event.ts";
import { Weekly } from "src/models/event_template_types/weekly.ts";

const WEEK_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 7;

export class WeeklyEventsGenerator {
  private template!: EventTemplate<Weekly>;
  private startDate!: Date;
  private endDate!: Date;
  private events!: Event<Weekly>[];

  generate(
    template: EventTemplate<Weekly>,
    startDate: Date,
    endDate: Date
  ): Event<Weekly>[] {
    this.template = template;
    let eventDate = new Date(template.startOn);
    this.startDate = startDate;
    this.endDate = endDate;
    this.events = [];

    if (this.template.type.repeatEvery === 0) {
      this.generateNonRepeating(eventDate);
    } else {
      this.generateRepeating(eventDate);
    }

    return this.events;
  }

  private generateNonRepeating(eventDate: Date): void {
    if (
      eventDate.getTime() >= this.startDate.getTime() &&
      eventDate.getTime() < this.endDate.getTime()
    ) {
      this.events.push(this.createEvent(eventDate));
    }
  }

  private generateRepeating(eventDate: Date): void {
    const weeksSinceStart = Math.floor(
      (this.startDate.getTime() - eventDate.getTime()) / WEEK_IN_MILLISECONDS
    );

    let daysToNextEvent =
      (7 + this.template.type.dayOfWeek - eventDate.getDay()) % 7;
    if (weeksSinceStart % this.template.type.repeatEvery !== 0) {
      daysToNextEvent +=
        Math.floor(weeksSinceStart / this.template.type.repeatEvery) *
        this.template.type.repeatEvery *
        7;
    }

    eventDate.setDate(eventDate.getDate() + daysToNextEvent);

    while (eventDate.getTime() < this.endDate.getTime()) {
      this.events.push(this.createEvent(eventDate));
      eventDate.setDate(
        eventDate.getDate() + this.template.type.repeatEvery * 7
      );
    }
  }

  private createEvent(eventDate: Date): Event<Weekly> {
    eventDate.setHours(this.template.type.hour);
    eventDate.setMinutes(this.template.type.minute);

    return {
      template: this.template,
      startTimestamp: eventDate.getTime(),
      endTimestamp: eventDate.getTime() + this.template.type.duration,
    };
  }
}
