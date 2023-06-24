import { EventsService } from 'src/services/events_service.ts';
import { InMemoryEventTemplatePort } from 'src/adapters/in_memory_event_template_port.ts';
import { Daily } from 'src/models/event_template_types/daily.ts';
import { DailyEventsGenerator } from 'src/services/daily_events_generator.ts';

describe('DailyService', () => {
  let service:  EventsService<Daily>;
  let eventsPort: InMemoryEventTemplatePort<Daily>;
  let generator: DailyEventsGenerator;

  beforeEach(() => {
    generator = new DailyEventsGenerator();
    eventsPort = new InMemoryEventTemplatePort<Daily>();
    service = new EventsService<Daily>(eventsPort, generator);
  });

  // Single non-repeating event
  test('creates single event for non-repeating template', async () => {
    // arrange
    const template = {
      id: "some_guid",
      type: {
        name: "daily",
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 0,
        isAllDay: false,
      },
      label: "Single Event",
      notes: "This is a single, non-repeating event.",
      iconName: "Event",
      startOn: new Date(2023, 0, 1).getTime(), // January 1, 2023
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };

    await service.saveEvent(template);

    // act
    const events = await service.getEvents(new Date(2023, 0, 1), new Date(2023, 0, 2)); // January 1 to 2, 2023

    // assert
    // Check that exactly one event is returned
    expect(events.length).toBe(1);
    expect(events[0].template.id).toBe(template.id);
  });

  // Multiple repeating events
  test('creates multiple events for repeating template', async () => {
    // arrange
    const template = {
      id: "some_guid",
      type: {
        name: "daily",
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Single Event",
      notes: "This is a single, non-repeating event.",
      iconName: "Event",
      startOn: new Date(2023, 0, 1).getTime(), // January 1, 2023
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(new Date(2023, 0, 1), new Date(2023, 0, 4)); // January 1 to 4, 2023

    // assert
    // Check that three events are returned
    expect(events.length).toBe(3);
    expect(events.every(event => event.template.id === template.id)).toBeTruthy();
  });

  // No events before startOn date
  test('does not create events before startOn date', async () => {
    // arrange
    const template = {
      id: "some_guid",
      type: {
        name: "daily",
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Single Event",
      notes: "This is a single, non-repeating event.",
      iconName: "Event",
      startOn: new Date(2023, 0, 2).getTime(), // January 1, 2023
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(new Date(2023, 0, 1), new Date(2023, 0, 2)); // January 1 to 2, 2023

    // assert
    // Check that no events are returned
    expect(events.length).toBe(0);
  });

  test('does not create events before startOn date, start in the middle of range', async () => {
    // arrange
    const template = {
      id: "some_guid",
      type: {
        name: "daily",
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Single Event",
      notes: "This is a single, non-repeating event.",
      iconName: "Event",
      startOn: new Date(2023, 0, 2).getTime(), // January 1, 2023
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: null,
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(new Date(2023, 0, 1), new Date(2023, 0, 4)); // January 1 to 2, 2023

    // assert
    // Check that no events are returned
    expect(events.length).toBe(2);
  });

  test('does not create events when template is deleted', async () => {
    // arrange
    const template = {
      id: "some_guid",
      type: {
        name: "daily",
        hour: 8,
        minute: 0,
        duration: 60 * 60 * 1000, // 60 minutes in milliseconds
        repeatEvery: 1,
        isAllDay: false,
      },
      label: "Single Event",
      notes: "This is a single, non-repeating event.",
      iconName: "Event",
      startOn: new Date(2023, 0, 1).getTime(), // January 1, 2023
      createdOn: new Date(2023, 0, 1).getTime(),
      updatedOn: new Date(2023, 0, 1).getTime(),
      deletedOn: new Date(2023, 0, 1).getTime(),
    };
    await service.saveEvent(template);

    // act
    const events = await service.getEvents(new Date(2023, 0, 1), new Date(2023, 0, 2)); // January 1 to 2, 2023

    // assert
    // Check that no events are returned
    expect(events.length).toBe(0);
  });

});
