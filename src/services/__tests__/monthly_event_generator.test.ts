import { IEventTemplate } from "src/models/i_event_template.ts";
import { EventTypeName } from "src/models/event_type_name.ts";
import { Days } from "src/models/days.ts";
import { MonthlyEventGenerator } from "src/services/monthly_event_generator.ts";
import { IMonthlyRecurringEventType } from "src/models/event_template_types/i_monthly_recurring_event_type.ts";

describe("MonthlyEventGenerator", () => {
  let generator: MonthlyEventGenerator;
  let template: IEventTemplate<IMonthlyRecurringEventType>;

  beforeEach(() => {
    generator = new MonthlyEventGenerator();

    template = {
      id: "1",
      title: "Test event",
      notes: null,
      eventType: {
        name: EventTypeName.Monthly,
        repeatOnDays: [Days.Monday],
        repeatOnWeekNumber: 2,
        startTime: 9 * 60 * 60 * 1000, // 9:00 AM
        duration: 60 * 60 * 1000, // 1 hour
        startOn: new Date(2023, 0, 1).getTime(),
        endOn: null,
      },
    };
  });

  it("generates correct events from a monthly recurring event template", () => {
    const startDate = new Date(2023, 0, 1); // January 1, 2023
    const endDate = new Date(2023, 2, 31); // March 31, 2023

    const events = generator.generate(template, startDate, endDate);

    expect(events.length).toBe(3);
    expect(events[0].startTimestamp).toBe(new Date(2023, 0, 9, 9).getTime());
    expect(events[0].endTimestamp).toBe(new Date(2023, 0, 9, 10).getTime());
    expect(events[1].startTimestamp).toBe(new Date(2023, 1, 13, 9).getTime());
    expect(events[1].endTimestamp).toBe(new Date(2023, 1, 13, 10).getTime());
    expect(events[2].startTimestamp).toBe(new Date(2023, 2, 13, 9).getTime());
    expect(events[2].endTimestamp).toBe(new Date(2023, 2, 13, 10).getTime());
  });

  it("returns empty array when startDate is after endDate", () => {
    const startDate = new Date(2023, 2, 31); // March 31, 2023
    const endDate = new Date(2023, 0, 1); // January 1, 2023
    const events = generator.generate(template, startDate, endDate);

    expect(events.length).toBe(0);
  });

  it("correctly generates events when repeatOnWeekNumber is negative", () => {
    template.eventType.repeatOnWeekNumber = -1; // Last week of the month

    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(2023, 1, 28);

    const events = generator.generate(template, startDate, endDate);

    expect(events.length).toBe(2);
    expect(events[0].startTimestamp).toBe(new Date(2023, 0, 30, 9).getTime());
    expect(events[0].endTimestamp).toBe(new Date(2023, 0, 30, 10).getTime());
    expect(events[1].startTimestamp).toBe(new Date(2023, 1, 27, 9).getTime());
    expect(events[1].endTimestamp).toBe(new Date(2023, 1, 27, 10).getTime());
    // Add checks to ensure the events fall on the last week of each month
  });

  it("correctly omits past events when startDate is in the future compared to the startOn date", () => {
    template.eventType.startOn = new Date(2022, 0, 1).getTime(); // Start from Jan 1, 2022
    const startDate = new Date(2023, 0, 1); // January 1, 2023
    const endDate = new Date(2023, 2, 31); // March 31, 2023

    const events = generator.generate(template, startDate, endDate);

    expect(events.length).toBe(3);
    // Add more checks to ensure no events from 2022 are included
    expect(events[0].startTimestamp).toBe(new Date(2023, 0, 9, 9).getTime());
    expect(events[0].endTimestamp).toBe(new Date(2023, 0, 9, 10).getTime());
    expect(events[1].startTimestamp).toBe(new Date(2023, 1, 13, 9).getTime());
    expect(events[1].endTimestamp).toBe(new Date(2023, 1, 13, 10).getTime());
    expect(events[2].startTimestamp).toBe(new Date(2023, 2, 13, 9).getTime());
    expect(events[2].endTimestamp).toBe(new Date(2023, 2, 13, 10).getTime());
  });

  it("generates events on the second last week of the month", () => {
    template.eventType.repeatOnWeekNumber = -2; // Second last week of the month
    template.eventType.repeatOnDays = [Days.Monday]; // Monday

    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(2023, 1, 28);

    const events = generator.generate(template, startDate, endDate);

    expect(events.length).toBe(2);
    expect(events[0].startTimestamp).toBe(new Date(2023, 0, 23, 9).getTime());
    expect(events[0].endTimestamp).toBe(new Date(2023, 0, 23, 10).getTime());
    expect(events[1].startTimestamp).toBe(new Date(2023, 1, 20, 9).getTime());
    expect(events[1].endTimestamp).toBe(new Date(2023, 1, 20, 10).getTime());
  });

  it("generates the right events with Monday Wednesday and Friday on different weeks.", () => {
    template.eventType.repeatOnWeekNumber = -1; // Last week of the month
    template.eventType.repeatOnDays = [
      Days.Monday,
      Days.Wednesday,
      Days.Friday,
    ];

    const startDate = new Date(2023, 1, 1);
    const endDate = new Date(2023, 1, 28);

    const events = generator.generate(template, startDate, endDate);

    expect(events.length).toBe(3);
    expect(events[0].startTimestamp).toBe(new Date(2023, 1, 27, 9).getTime());
    expect(events[0].endTimestamp).toBe(new Date(2023, 1, 27, 10).getTime());
    expect(events[1].startTimestamp).toBe(new Date(2023, 1, 22, 9).getTime());
    expect(events[1].endTimestamp).toBe(new Date(2023, 1, 22, 10).getTime());
    expect(events[2].startTimestamp).toBe(new Date(2023, 1, 24, 9).getTime());
    expect(events[2].endTimestamp).toBe(new Date(2023, 1, 24, 10).getTime());
  });

  it("generates events on the last week of the month", () => {
    template.eventType.repeatOnWeekNumber = -1; // Last week of the month
    template.eventType.repeatOnDays = [Days.Monday]; // Monday

    const startDate = new Date(2023, 0, 1); // January 1, 2023
    const endDate = new Date(2023, 2, 31); // December 31, 2023

    const events = generator.generate(template, startDate, endDate);
    expect(events.length).toBe(3);
    expect(events[0].startTimestamp).toBe(new Date(2023, 0, 30, 9).getTime());
    expect(events[0].endTimestamp).toBe(new Date(2023, 0, 30, 10).getTime());
    expect(events[1].startTimestamp).toBe(new Date(2023, 1, 27, 9).getTime());
    expect(events[1].endTimestamp).toBe(new Date(2023, 1, 27, 10).getTime());
    expect(events[2].startTimestamp).toBe(new Date(2023, 2, 27, 9).getTime());
    expect(events[2].endTimestamp).toBe(new Date(2023, 2, 27, 10).getTime());
  });
});
