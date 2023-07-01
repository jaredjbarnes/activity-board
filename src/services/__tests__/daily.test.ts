import { EventsService } from "src/services/events_service.ts";
import { InMemoryEventTemplateAdapter } from "src/adapters/in_memory_event_template_adapter.ts";
import { Daily } from "src/models/event_template_types/daily.ts";
import { DailyEventsGenerator } from "src/services/daily_events_generator.ts";
import { TemplateName } from "src/models/event_template_types/template_name.ts";
import { EventTemplate } from "src/models/event_template.ts";

describe("DailyService", () => {
  let service: EventsService<Daily>;
  let eventsPort: InMemoryEventTemplateAdapter<Daily>;
  let generator: DailyEventsGenerator;

  beforeEach(() => {
    generator = new DailyEventsGenerator();
    eventsPort = new InMemoryEventTemplateAdapter<Daily>();
    service = new EventsService<Daily>(eventsPort, generator);
  });

  // Single non-repeating event
  test("creates single event for non-repeating template", async () => {
    // arrange
    const template: EventTemplate<Daily> = {
      id: "some_guid",
      type: {
        name: TemplateName.DAILY,
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000,
        repeatEvery: 0,
        isAllDay: false,
      },
      label: "Single Event",
      notes: "This is a single, non-repeating event.",
      iconName: "Event",
      start: new Date(2023, 0, 1).getTime(),
      end: new Date(2024, 0, 1).getTime(),
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };

    await service.saveEvent(template);

    // act
    const events = await service.getEvents(
      new Date(2023, 0, 1),
      new Date(2023, 0, 2)
    ); // January 1 to 2, 2023

    // assert
    // Check that exactly one event is returned
    expect(events.length).toBe(1);
    expect(events[0].template.id).toBe(template.id);
  });

  // Multiple repeating events
  test("creates multiple events for repeating template", async () => {
    // arrange
    const template: EventTemplate<Daily> = {
      id: "some_guid",
      type: {
        name: TemplateName.DAILY,
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Multiple Event",
      notes: "This is multiple, repeating event.",
      iconName: "Event",
      start: new Date(2023, 0, 1).getTime(),
      end: new Date(2024, 0, 1).getTime(),
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(
      new Date(2023, 0, 1),
      new Date(2023, 0, 4)
    ); // January 1 to 4, 2023

    // assert
    // Check that three events are returned
    expect(events.length).toBe(3);
    expect(
      events.every((event) => event.template.id === template.id)
    ).toBeTruthy();
  });

  test("creates multiple events for repeating template with all day", async () => {
    // arrange
    const template: EventTemplate<Daily> = {
      id: "some_guid",
      type: {
        name: TemplateName.DAILY,
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: true,
      },
      label: "Multiple Event",
      notes: "This is multiple, repeating event.",
      iconName: "Event",
      start: new Date(2023, 0, 1).getTime(),
      end: new Date(2024, 0, 1).getTime(),
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(
      new Date(2023, 0, 1),
      new Date(2023, 0, 4)
    ); // January 1 to 4, 2023

    // assert
    // Check that three events are returned
    expect(events.length).toBe(3);
    expect(
      events.every((event) => event.template.id === template.id)
    ).toBeTruthy();
  });

  // No events before startOn date
  test("does not create events before start date", async () => {
    // arrange
    const template: EventTemplate<Daily> = {
      id: "some_guid",
      type: {
        name: TemplateName.DAILY,
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Event",
      notes: "This is an event.",
      iconName: "Event",
      start: new Date(2023, 0, 2).getTime(),
      end: new Date(2024, 0, 1).getTime(),
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(
      new Date(2023, 0, 1),
      new Date(2023, 0, 2)
    ); // January 1 to 2, 2023

    // assert
    // Check that no events are returned
    expect(events.length).toBe(0);
  });

  test("does not create events before start date, but starts in the middle of range", async () => {
    // arrange
    const template: EventTemplate<Daily> = {
      id: "some_guid",
      type: {
        name: TemplateName.DAILY,
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Multiple Event",
      notes: "This is multiple, repeating event.",
      iconName: "Event",
      start: new Date(2023, 0, 2).getTime(),
      end: new Date(2024, 0, 1).getTime(),
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(
      new Date(2023, 0, 1),
      new Date(2023, 0, 4)
    ); 

    // assert
    // Check that no events are returned
    expect(events.length).toBe(2);
  });

  test("stop repeating if the end has past", async () => {
    // arrange
    const template: EventTemplate<Daily> = {
      id: "some_guid",
      type: {
        name: TemplateName.DAILY,
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Repeat Event",
      notes: "This is a repeating event",
      iconName: "Event",
      start: new Date(2023, 0, 1).getTime(),
      end: new Date(2023, 0, 3).getTime(),
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(
      new Date(2023, 0, 1),
      new Date(2023, 0, 4)
    ); 
    // assert
    expect(events.length).toBe(2);
  });

  test("creates event if the start is in the middle of the event", async () => {
    // arrange
    const template: EventTemplate<Daily> = {
      id: "some_guid",
      type: {
        name: TemplateName.DAILY,
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Multiple Event",
      notes: "This is multiple, repeating event.",
      iconName: "Event",
      start: new Date(2023, 0, 1).getTime(),
      end: new Date(2024, 0, 1).getTime(),
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(
      new Date(2023, 0, 1, 8, 30, 0, 0),
      new Date(2023, 0, 4)
    ); // January 1 to 2, 2023

    // assert
    // Check that no events are returned
    expect(events.length).toBe(3);
  });

  test("does not create events when template is deleted", async () => {
    // arrange
    const template: EventTemplate<Daily> = {
      id: "some_guid",
      type: {
        name: TemplateName.DAILY,
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Single Event",
      notes: "This is a single, non-repeating event.",
      iconName: "Event",
      start: new Date(2023, 0, 1).getTime(),
      end: new Date(2024, 0, 1).getTime(),
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: new Date(2023, 0, 1).getTime(),
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(
      new Date(2023, 0, 1),
      new Date(2023, 0, 2)
    ); // January 1 to 2, 2023

    // assert
    // Check that no events are returned
    expect(events.length).toBe(0);
  });
});
