import { EventTemplate } from "src/models/event_template.ts";
import { TemplateName } from "src/models/event_template_types/template_name.ts";
import { FirstDayOfWeek } from "src/models/event_template_types/first_day_of_week.ts";
import { DayOfWeek } from "src/models/event_template_types/day_of_week.ts";
import { FirstDayOfWeekEventsGenerator } from "src/services/first_day_of_week_generator.ts";

function createBaseTemplate(): EventTemplate<FirstDayOfWeek> {
  return {
    id: "id",
    label: "Event",
    notes: "",
    iconName: "Event",
    start: new Date("2023-01-01").getTime(),
    end: null,
    createdOn: new Date("2023-01-01").getTime(),
    updatedOn: new Date("2023-01-01").getTime(),
    deletedOn: null,
    type: {
      name: TemplateName.FIRST_DAY_OF_WEEK,
      daysOfWeek: DayOfWeek.Monday,
      duration: 3600000,
      hour: 10,
      minute: 0,
      isAllDay: false,
    },
  };
}

describe("FirstDayOfWeekEventsGenerator", () => {
  let generator: FirstDayOfWeekEventsGenerator;
  let startDate: Date;
  let endDate: Date;

  beforeEach(() => {
    generator = new FirstDayOfWeekEventsGenerator();
    startDate = new Date("2023-01-01");
    endDate = new Date("2023-12-31");
  });

  test("should generate event for first week of month", () => {
    const template = createBaseTemplate();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(12); // One for each month
  });

  test("should not generate event when first week is not within range", () => {
    const template = createBaseTemplate();
    startDate = new Date("2023-02-20");
    endDate = new Date("2023-02-28");
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(0);
  });

  test("should generate multiple events for multiple first weeks within range", () => {
    const template = createBaseTemplate();
    startDate = new Date("2023-01-01");
    endDate = new Date("2023-03-31");
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(3); // January, February, and March
  });

  test("should not generate events for deleted templates", () => {
    const template = createBaseTemplate();
    template.deletedOn = new Date().getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(0);
  });

  test("should generate event with correct duration, hour, and minute", () => {
    const template = createBaseTemplate();
    const events = generator.generate(template, startDate, endDate);
    const eventDate = new Date(events[0].startTimestamp);
    expect(eventDate.getHours()).toEqual(10);
    expect(eventDate.getMinutes()).toEqual(0);
    expect(events[0].endTimestamp - events[0].startTimestamp).toEqual(3600000); // 1 hour
  });

  test("should generate events correctly when template end date is before endDate", () => {
    const template = createBaseTemplate();
    template.end = new Date("2023-06-30").getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(6);
  });

  test("should generate events correctly when template end date is after endDate", () => {
    const template = createBaseTemplate();
    template.end = new Date("2024-06-30").getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(12);
  });

  test("should not generate event when start date of template is before start date of range", () => {
    const template = createBaseTemplate();
    template.start = new Date("2022-12-01").getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(12);
  });

  test("should not generate event when start date of template is after start date of range", () => {
    const template = createBaseTemplate();
    template.start = new Date("2023-02-01").getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(11); // February to December
  });
});
