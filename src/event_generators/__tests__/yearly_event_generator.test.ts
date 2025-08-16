import { IYearlyRecurringEventType } from "src/models/event_template_types/i_yearly_event_type.ts";
import { EventTypeName } from "src/models/event_template_types/event_type_name.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { Months } from "src/models/months.ts";
import { YearlyEventGenerator } from "src/event_generators/yearly_event_generator.ts";

function getYearlyTemplate(): IEventTemplate<IYearlyRecurringEventType> {
  return {
    id: "1",
    title: "Yearly Event",
    notes: null,
    eventType: {
      name: EventTypeName.Yearly,
      startTime: 9 * 60 * 60 * 1000, // 9:00 AM
      duration: 60 * 60 * 1000, // 1 hour
      startOn: new Date(2023, Months.January, 1).getTime(),
      endOn: new Date(2025, Months.December, 31).getTime(),
      repeatOnMonth: Months.January,
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
      new Date(2023, Months.January, 1),
      new Date(2025, Months.December, 31),
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
      new Date(2024, Months.January, 2),
      new Date(2025, Months.December, 31),
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
      new Date(2023, Months.January, 1),
      new Date(2023, Months.December, 31),
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
      new Date(2023, Months.January, 1),
      new Date(2023, Months.December, 31),
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
      new Date(2023, Months.January, 1),
      new Date(2023, Months.December, 31),
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
      new Date(2023, Months.January, 1),
      new Date(2024, Months.January, 1),
      new Map()
    );
    expect(events.length).toBe(1);
  });

  it("handles Feb 29 correctly in non-leap years", () => {
    const template = getYearlyTemplate();
    template.eventType.repeatOnMonth = Months.February;
    template.eventType.repeatOnDay = 29;
    const events = generator.generate(
      template,
      new Date(2023, Months.January, 1),
      new Date(2024, Months.December, 31),
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
      new Date(2023, Months.January, 1),
      new Date(2025, Months.December, 31),
      new Map()
    );
    expect(events.length).toBe(3);
  });
});
