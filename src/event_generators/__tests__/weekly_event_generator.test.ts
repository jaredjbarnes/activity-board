import { Days } from "src/models/event_template_types/days.ts";
import { IDaysOfWeekEventType } from "src/models/event_template_types/i_days_of_week_event_type.ts";
import { EventTypeName } from "src/models/event_template_types/event_type_name.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { WeeklyEventGenerator } from "src/event_generators/weekly_event_generator.ts";

function createTemplate(
  startDay: number,
  days: Days[],
  interval: number
): IEventTemplate<IDaysOfWeekEventType> {
  return {
    id: "1",
    title: "Weekly Meeting",
    notes: null,
    eventType: {
      name: EventTypeName.DayOfWeek,
      startTime: 9 * 60 * 60 * 1000, // 9:00 AM
      duration: 60 * 60 * 1000, // 1 hour
      startOn: startDay,
      endOn: null,
      repeatOnDays: days,
      repeatIntervalByWeek: interval,
    } as IDaysOfWeekEventType,
  };
}

describe("WeeklyEventGenerator", () => {
  it("generates regular weekly events within the range", () => {
    const generator = new WeeklyEventGenerator();
    const template = createTemplate(
      new Date(2023, 6, 2).getTime(),
      [Days.Monday, Days.Wednesday, Days.Friday],
      1
    );

    const startDate = new Date(2023, 6, 2); // July 2, 2023
    const endDate = new Date(2023, 6, 8); // July 8, 2023

    const events = generator.generate(template, startDate, endDate, new Map());

    expect(events.length).toBe(3);
    expect(events[0].startTimestamp).toBe(new Date(2023, 6, 3, 9).getTime()); // July 3, 2023, 9:00 AM
    expect(events[1].startTimestamp).toBe(new Date(2023, 6, 5, 9).getTime()); // July 5, 2023, 9:00 AM
    expect(events[2].startTimestamp).toBe(new Date(2023, 6, 7, 9).getTime()); // July 7, 2023, 9:00 AM
  });

  it("does not generate events after the endOn date", () => {
    const generator = new WeeklyEventGenerator();
    const template = createTemplate(
      new Date(2023, 6, 2).getTime(),
      [Days.Monday, Days.Wednesday, Days.Friday],
      1
    );
    template.eventType.endOn = new Date(2023, 6, 6).getTime(); // July 5, 2023

    const startDate = new Date(2023, 6, 2); // July 2, 2023
    const endDate = new Date(2023, 6, 8); // July 8, 2023

    const events = generator.generate(template, startDate, endDate, new Map());

    expect(events.length).toBe(2);
    expect(events[0].startTimestamp).toBe(new Date(2023, 6, 3, 9).getTime()); // July 3, 2023, 9:00 AM
    expect(events[1].startTimestamp).toBe(new Date(2023, 6, 5, 9).getTime()); // July 5, 2023, 9:00 AM
  });

  it("respects the repeatInterval", () => {
    const generator = new WeeklyEventGenerator();
    const template = createTemplate(
      new Date(2023, 6, 1).getTime(),
      [Days.Monday],
      2
    ); // Only on Mondays, every 2 weeks

    const startDate = new Date(2023, 6, 1); // July 1, 2023
    const endDate = new Date(2023, 6, 31); // July 31, 2023

    const events = generator.generate(template, startDate, endDate, new Map());

    expect(events.length).toBe(2);
    expect(events[0].startTimestamp).toBe(new Date(2023, 6, 3, 9).getTime()); // July 3, 2023, 9:00 AM
    expect(events[1].startTimestamp).toBe(new Date(2023, 6, 17, 9).getTime()); // July 17, 2023, 9:00 AM
  });

  it("does not generate events for non-weekly templates", () => {
    const generator = new WeeklyEventGenerator();
    const template = createTemplate(
      new Date(2023, 6, 2).getTime(),
      [Days.Monday, Days.Wednesday, Days.Friday],
      1
    ) as any;
    
    template.eventType.name = EventTypeName.WeekOfMonth; // Change to monthly

    const startDate = new Date(2023, 6, 2); // July 2, 2023
    const endDate = new Date(2023, 6, 8); // July 8, 2023

    const events = generator.generate(template, startDate, endDate, new Map());

    expect(events.length).toBe(0);
  });

  it("does not generate events if startDate is after endDate", () => {
    const generator = new WeeklyEventGenerator();
    const template = createTemplate(
      new Date(2023, 6, 2).getTime(),
      [Days.Monday, Days.Wednesday, Days.Friday],
      1
    );

    const startDate = new Date(2023, 6, 8); // July 8, 2023
    const endDate = new Date(2023, 6, 2); // July 2, 2023

    const events = generator.generate(template, startDate, endDate, new Map());

    expect(events.length).toBe(0);
  });
});
