import { IYearlyRecurringEventType } from "src/event_generator/models/event_template_types/i_yearly_event_type.ts";
import { EventTypeName } from "src/event_generator/models/event_template_types/event_type_name.ts";
import { IEventTemplate } from "src/event_generator/models/i_event_template.ts";
import { Month } from "src/event_generator/models/month.ts";
import { YearlyEventGenerator } from "src/event_generator/event_generators/yearly_event_generator.ts";

function getYearlyTemplate(): IEventTemplate<IYearlyRecurringEventType> {
  return {
    id: "1",
    title: "Yearly Event",
    notes: null,
    eventType: {
      name: EventTypeName.Yearly,
      startTime: 9 * 60 * 60 * 1000, // 9:00 AM
      duration: 60 * 60 * 1000, // 1 hour
      startOn: new Date(2023, Month.January, 1).getTime(),
      endOn: new Date(2025, Month.December, 31).getTime(),
      repeatOnMonth: Month.January,
      repeatOnDay: 1,
      repeatIntervalByYear: 1,
    } as IYearlyRecurringEventType,
  };
}

describe("YearlyEventGenerator", () => {
  const generator = new YearlyEventGenerator();

  it("generates events for each year within the range", () => {
    const template = getYearlyTemplate();
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2025, Month.December, 31),
      new Map()
    );
    expect(events.length).toBe(3);
    expect(events.map((e) => new Date(e.startTimestamp).getFullYear())).toEqual(
      [2023, 2024, 2025]
    );
  });

  it("does not generate events outside of range", () => {
    const template = getYearlyTemplate();
    const events = generator.generate(
      template,
      new Date(2024, Month.January, 2),
      new Date(2025, Month.December, 31),
      new Map()
    );
    expect(events.length).toBe(1);
    expect(events.map((e) => new Date(e.startTimestamp).getFullYear())).toEqual(
      [2025]
    );
  });

  it("generates events with correct duration", () => {
    const template = getYearlyTemplate();
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2023, Month.December, 31),
      new Map()
    );
    expect(events[0].endTimestamp - events[0].startTimestamp).toBe(
      template.eventType.duration
    );
  });

  it("generates events with correct start time", () => {
    const template = getYearlyTemplate();
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2023, Month.December, 31),
      new Map()
    );
    const date = new Date(events[0].startTimestamp);
    expect(date.getHours()).toBe(9);
    expect(date.getMinutes()).toBe(0);
  });

  it("generates events on the specific month and day", () => {
    const template = getYearlyTemplate();
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2023, Month.December, 31),
      new Map()
    );
    const date = new Date(events[0].startTimestamp);
    expect(date.getDate()).toBe(template.eventType.repeatOnDay);
    expect(date.getMonth()).toBe(template.eventType.repeatOnMonth);
  });

  it("does not generate event on end date if before event start time", () => {
    const template = getYearlyTemplate();
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2024, Month.January, 1),
      new Map()
    );
    expect(events.length).toBe(1);
  });

  it("handles Feb 29 correctly in non-leap years", () => {
    const template = getYearlyTemplate();
    template.eventType.repeatOnMonth = Month.February;
    template.eventType.repeatOnDay = 29;
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2024, Month.December, 31),
      new Map()
    );
    expect(events.length).toBe(2);
    expect(new Date(events[0].startTimestamp).getDate()).toBe(28);
    expect(new Date(events[0].startTimestamp).getFullYear()).toBe(2023); 
    expect(new Date(events[1].startTimestamp).getDate()).toBe(29);
    expect(new Date(events[1].startTimestamp).getFullYear()).toBe(2024); 
  });

  it("handles null endOn in the event template", () => {
    const template = getYearlyTemplate();
    template.eventType.endOn = null;
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2025, Month.December, 31),
      new Map()
    );
    expect(events.length).toBe(3);
  });

  it("respects the repeatIntervalByYear", () => {
    const template = getYearlyTemplate();
    template.eventType.repeatIntervalByYear = 2; // Every 2 years
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2027, Month.December, 31),
      new Map()
    );
    expect(events.length).toBe(3); // 2023, 2025, 2027
    expect(events.map((e) => new Date(e.startTimestamp).getFullYear())).toEqual(
      [2023, 2025, 2027]
    );
  });

  it("respects the repeatIntervalByYear with every 3 years", () => {
    const template = getYearlyTemplate();
    template.eventType.repeatIntervalByYear = 3; // Every 3 years
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2030, Month.December, 31),
      new Map()
    );
    expect(events.length).toBe(3); // 2023, 2026, 2029
    expect(events.map((e) => new Date(e.startTimestamp).getFullYear())).toEqual(
      [2023, 2026, 2029]
    );
  });

  it("respects the repeatIntervalByYear with every 5 years", () => {
    const template = getYearlyTemplate();
    template.eventType.repeatIntervalByYear = 5; // Every 5 years
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2040, Month.December, 31),
      new Map()
    );
    expect(events.length).toBe(4); // 2023, 2028, 2033, 2038
    expect(events.map((e) => new Date(e.startTimestamp).getFullYear())).toEqual(
      [2023, 2028, 2033, 2038]
    );
  });

  it("handles large repeatIntervalByYear values", () => {
    const template = getYearlyTemplate();
    template.eventType.repeatIntervalByYear = 10; // Every 10 years
    const events = generator.generate(
      template,
      new Date(2023, Month.January, 1),
      new Date(2050, Month.December, 31),
      new Map()
    );
    expect(events.length).toBe(3); // 2023, 2033, 2043
    expect(events.map((e) => new Date(e.startTimestamp).getFullYear())).toEqual(
      [2023, 2033, 2043]
    );
  });

  it("handles February 29 with repeatIntervalByYear", () => {
    const template = getYearlyTemplate();
    template.eventType.repeatOnMonth = Month.February;
    template.eventType.repeatOnDay = 29;
    template.eventType.repeatIntervalByYear = 4; // Every 4 years (leap years)
    template.eventType.startOn = new Date(2024, Month.January, 1).getTime(); // Start from leap year
    const events = generator.generate(
      template,
      new Date(2024, Month.January, 1),
      new Date(2035, Month.December, 31),
      new Map()
    );
    expect(events.length).toBe(3); // 2024, 2028, 2032
    expect(events.map((e) => new Date(e.startTimestamp).getFullYear())).toEqual(
      [2024, 2028, 2032]
    );
    // All events should be on February 29
    events.forEach(event => {
      const date = new Date(event.startTimestamp);
      expect(date.getDate()).toBe(29);
      expect(date.getMonth()).toBe(Month.February);
    });
  });
});
