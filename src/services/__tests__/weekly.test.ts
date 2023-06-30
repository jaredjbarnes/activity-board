import { EventTemplate } from "src/models/event_template.ts";
import { TemplateName } from "src/models/event_template_types/template_name.ts";
import { Weekly } from "src/models/event_template_types/weekly.ts";
import { WeeklyEventsGenerator } from "src/services/weekly_events_generator.ts";


function createBaseTemplate(): EventTemplate<Weekly>{
  return {
    id: "id",
    label: "Event",
    notes: "",
    iconName: "Event",
    start: new Date("July 1, 2023").getTime(),
    end: null,
    createdOn: new Date("July 1, 2023").getTime(),
    updatedOn: new Date("July 1, 2023").getTime(),
    deletedOn: null,
    type: {
      name: TemplateName.WEEKLY,
      repeatEvery: 1,
      dayOfWeek: 1,
      duration: 3600000,
      hour: 10,
      minute: 0,
    },
  }
}

describe("WeeklyEventsGenerator", () => {
  let generator: WeeklyEventsGenerator;
  let startDate: Date;
  let endDate: Date;

  beforeEach(() => {
    generator = new WeeklyEventsGenerator();
    startDate = new Date("July 1, 2023");
    endDate = new Date("July 31, 2023");
  });

  test("should generate non-repeating events correctly", () => {
    const template = createBaseTemplate();
    template.type.repeatEvery = 0;
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(1);
  });

  test("should generate repeating events correctly", () => {
    const template = createBaseTemplate();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(4);
  });

  test("should not generate events for deleted templates", () => {
    const template = createBaseTemplate();
    template.deletedOn = new Date().getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(0);
  });

  test("should generate events correctly when template end date is null", () => {
    const template = createBaseTemplate();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(4);
  });

  test("should generate events correctly when template end date is before endDate", () => {
    const template = createBaseTemplate();
    template.end = new Date("July 15, 2023").getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(2);
  });

  test("should generate events correctly when template end date is after endDate", () => {
    const template = createBaseTemplate();
    template.end = new Date("August 15, 2023").getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(4);
  });

  test("should not generate event when out of startDate and endDate range", () => {
    const template = createBaseTemplate();
    template.start = new Date("June 15, 2023").getTime();
    template.end = new Date("June 30, 2023").getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events).toHaveLength(0);
  });

  test("should set correct start and end timestamps for events", () => {
    const template = createBaseTemplate();
    const events = generator.generate(template, startDate, endDate);
    const startTimestamp = events[0].startTimestamp;
    const endTimestamp = events[0].endTimestamp;
    expect(endTimestamp - startTimestamp).toEqual(3600000);
  });

  test("should set correct hour and minute for events", () => {
    const template = createBaseTemplate();
    const events = generator.generate(template, startDate, endDate);
    const eventDate = new Date(events[0].startTimestamp);
    expect(eventDate.getHours()).toEqual(10);
    expect(eventDate.getMinutes()).toEqual(0);
  });
});
