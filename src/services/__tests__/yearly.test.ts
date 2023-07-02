import { EventTemplate } from "src/models/event_template.ts";
import { TemplateName } from "src/models/event_template_types/template_name.ts";
import { Yearly } from "src/models/event_template_types/yearly.ts";
import { YearlyEventsGenerator } from "src/services/yearly_events_generator.ts";

describe("YearlyEventsGenerator", () => {
  const generator = new YearlyEventsGenerator();
  const startDate = new Date(2023, 0, 1);
  const endDate = new Date(2025, 11, 31);

  // Create a base template
  const baseTemplate: EventTemplate<Yearly> = {
    id: "",
    label: "",
    notes: "",
    iconName: "",
    start: new Date(2023, 5, 15).getTime(),
    end: null,
    createdOn: 0,
    updatedOn: 0,
    deletedOn: null,
    activity: null,
    type: {
      name: TemplateName.YEARLY,
      day: 15,
      month: 5,
      year: 2023,
      hour: 12,
      minute: 0,
      duration: 60 * 60 * 1000,
      repeatEvery: 0,
    },
  };

  // Function to create a template with overridden properties
  const createTemplate = (overrides: any): EventTemplate<Yearly> => {
    return {
      ...baseTemplate,
      ...overrides,
      type: {
        ...baseTemplate.type,
        ...overrides.type,
      },
    };
  };

  it("should generate non-repeating events", () => {
    const template = createTemplate({});
    const events = generator.generate(template, startDate, endDate);
    expect(events.length).toEqual(1);
    expect(events[0].startTimestamp).toEqual(
      new Date(2023, 5, 15, 12, 0, 0).getTime()
    );
    expect(events[0].endTimestamp).toEqual(
      new Date(2023, 5, 15, 13, 0, 0).getTime()
    );
  });

  it("should generate repeating events", () => {
    const template = createTemplate({
      type: {
        repeatEvery: 1,
      },
    });
    const events = generator.generate(template, startDate, endDate);
    expect(events.length).toEqual(3);
    expect(events[0].startTimestamp).toEqual(
      new Date(2023, 5, 15, 12, 0, 0).getTime()
    );
    expect(events[0].endTimestamp).toEqual(
      new Date(2023, 5, 15, 13, 0, 0).getTime()
    );
    expect(events[1].startTimestamp).toEqual(
      new Date(2024, 5, 15, 12, 0, 0).getTime()
    );
    expect(events[1].endTimestamp).toEqual(
      new Date(2024, 5, 15, 13, 0, 0).getTime()
    );
    expect(events[2].startTimestamp).toEqual(
      new Date(2025, 5, 15, 12, 0, 0).getTime()
    );
    expect(events[2].endTimestamp).toEqual(
      new Date(2025, 5, 15, 13, 0, 0).getTime()
    );
  });

  it("should exclude deleted events", () => {
    const template = createTemplate({
      deletedOn: new Date("2022-12-31").getTime(),
    });
    const events = generator.generate(template, startDate, endDate);
    expect(events).toEqual([]);
  });

  it("should handle events with end time", () => {
    const template = createTemplate({
      end: new Date(2024, 5, 15, 13, 0, 0).getTime(),
      type: {
        repeatEvery: 1,
      },
    });
    const events = generator.generate(template, startDate, endDate);
    expect(events.length).toEqual(2); // Since the event end time is 2024, there should be 2 events (2023, 2024)
  });

  it("should handle events that start and end within the time", () => {
    const template = createTemplate({
      start: new Date(2023, 6, 0, 0, 0, 0).getTime(),
      end: new Date(2024, 5, 15, 13, 0, 0).getTime(),
      type: {
        repeatEvery: 1,
      },
    });
    const events = generator.generate(template, startDate, endDate);
    expect(events.length).toEqual(1); // Since the event end time is 2024, there should be 2 events (2023, 2024)
  });

  it("should handle events outside of date range", () => {
    const template = createTemplate({
      start: new Date(2030, 5, 15).getTime(),
    });
    const events = generator.generate(template, startDate, endDate);
    expect(events).toEqual([]); // Since the event is in 2030, it should not be included in the events list
  });
});
