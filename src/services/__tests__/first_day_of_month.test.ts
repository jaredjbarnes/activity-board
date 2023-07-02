import { EventTemplate } from "src/models/event_template.ts";
import { TemplateName } from "src/models/event_template_types/template_name.ts";
import { FirstDayOfMonth } from "src/models/event_template_types/first_day_of_month.ts";
import { FirstDayOfMonthEventsGenerator } from "src/services/first_day_of_month_events_generator.ts";

function createBaseTemplate(): EventTemplate<FirstDayOfMonth> {
  return {
    id: "id",
    label: "Event",
    notes: "",
    iconName: "Event",
    start: new Date("January 1, 2023").getTime(),
    end: new Date("December 31, 2023").getTime(),
    createdOn: new Date("January 1, 2023").getTime(),
    updatedOn: new Date("January 1, 2023").getTime(),
    deletedOn: null,
    activity: null,
    type: {
      name: TemplateName.FIRST_DAY_OF_MONTH,
      hour: 10,
      minute: 0,
      duration: 3600000, // in milliseconds, it represents 1 hour
      isAllDay: false
    },
  }
}


describe("FirstDayOfMonthEventsGenerator", () => {
  let generator: FirstDayOfMonthEventsGenerator;
  let startDate: Date;
  let endDate: Date;

  beforeEach(() => {
    generator = new FirstDayOfMonthEventsGenerator();
    startDate = new Date("January 1, 2023");
    endDate = new Date("December 31, 2023");
  });

  test("should generate events on the first day of each month", () => {
    const template = createBaseTemplate();
    const events = generator.generate(template, startDate, endDate);
    events.forEach((event) => {
      const eventDate = new Date(event.startTimestamp);
      expect(eventDate.getDate()).toBe(1);
    });
  });

  test("should not generate events after the template end date", () => {
    const template = createBaseTemplate();
    template.end = new Date("June 30, 2023").getTime();
    const events = generator.generate(template, startDate, endDate);
    expect(events[events.length - 1].startTimestamp).toBeLessThanOrEqual(template.end);
  });

  test("should not generate events after the template is deleted", () => {
    const template = createBaseTemplate();
    const deletedOn = new Date("June 30, 2023").getTime();
    template.deletedOn = deletedOn
    const events = generator.generate(template, startDate, endDate);
    events.forEach((event) => {
      expect(event.startTimestamp).toBeLessThanOrEqual(deletedOn);
    });
  });

  test("should generate an event if the start date is on the first day of a month", () => {
    const template = createBaseTemplate();
    startDate = new Date("June 1, 2023");
    const events = generator.generate(template, startDate, endDate);
    const firstEventDate = new Date(events[0].startTimestamp);
    expect(firstEventDate.getMonth()).toBe(startDate.getMonth());
  });

  test("should not generate an event for the month if the start date is not on the first day", () => {
    const template = createBaseTemplate();
    startDate = new Date("June 2, 2023");
    const events = generator.generate(template, startDate, endDate);
    const firstEventDate = new Date(events[0].startTimestamp);
    expect(firstEventDate.getMonth()).not.toBe(startDate.getMonth());
  });

  test("should generate an event if the end date is on the first day of a month", () => {
    const template = createBaseTemplate();
    endDate = new Date("December 1, 2023");
    const events = generator.generate(template, startDate, endDate);
    const lastEventDate = new Date(events[events.length - 1].startTimestamp);
    expect(lastEventDate.getMonth()).toBe(endDate.getMonth());
  });

  test("should not generate an event for the month if the end date is not on the first day", () => {
    const template = createBaseTemplate();
    endDate = new Date("December 2, 2023");
    const events = generator.generate(template, startDate, endDate);
    const lastEventDate = new Date(events[events.length - 1].startTimestamp);
    expect(lastEventDate.getMonth()).not.toBe(endDate.getMonth());
  });

  test("should set correct start and end timestamps for events", () => {
    const template = createBaseTemplate();
    const events = generator.generate(template, startDate, endDate);
    const startTimestamp = events[0].startTimestamp;
    const endTimestamp = events[0].endTimestamp;
    expect(endTimestamp - startTimestamp).toEqual(template.type.duration);
  });

  test("should set correct hour and minute for events", () => {
    const template = createBaseTemplate();
    const events = generator.generate(template, startDate, endDate);
    const eventDate = new Date(events[0].startTimestamp);
    expect(eventDate.getHours()).toEqual(template.type.hour);
    expect(eventDate.getMinutes()).toEqual(template.type.minute);
  });

  test("should span the entire day if isAllDay is set", () => {
    const template = createBaseTemplate();
    template.type.isAllDay = true;
    const events = generator.generate(template, startDate, endDate);
    const eventDateStart = new Date(events[0].startTimestamp);
    const eventDateEnd = new Date(events[0].endTimestamp);
    expect(eventDateStart.getHours()).toEqual(0);
    expect(eventDateStart.getMinutes()).toEqual(0);
    expect(eventDateEnd.getHours()).toEqual(23);
    expect(eventDateEnd.getMinutes()).toEqual(59);
  });
});
