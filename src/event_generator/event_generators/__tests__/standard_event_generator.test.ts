import { IStandardEventType } from "src/event_generator/models/event_template_types/i_standard_event_type.ts";
import { EventTypeName } from "src/event_generator/models/event_template_types/event_type_name.ts";
import { IEventTemplate } from "src/event_generator/models/i_event_template.ts";
import { StandardEventGenerator } from "src/event_generator/event_generators/standard_event_generator.ts";


const standardTemplate = (start: number, duration: number): IEventTemplate<IStandardEventType> => {
  return {
    id: "test-id",
    title: "Test Event",
    notes: null,
    eventType: {
      name: EventTypeName.Standard,
      startOn: start,
      duration: duration,
    },
  };
};

describe('StandardEventGenerator', () => {
  const generator = new StandardEventGenerator();
  const startRange = new Date(2023, 7, 1);
  const endRange = new Date(2023, 7, 31);

  test('event within the range', () => {
    const startTime = new Date(2023, 7, 5).getTime();
    const duration = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
    const template = standardTemplate(startTime, duration);
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(1);
    expect(events[0].startTimestamp).toBe(template.eventType.startOn);
    expect(events[0].endTimestamp).toBe(template.eventType.startOn + template.eventType.duration);
  });

  test('event intersects the start of the range', () => {
    const startTime = new Date(2023, 6, 25).getTime();
    const duration = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
    const template = standardTemplate(startTime, duration);
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(1);
    expect(events[0].startTimestamp).toBe(template.eventType.startOn);
    expect(events[0].endTimestamp).toBe(template.eventType.startOn + template.eventType.duration);
  });

  test('event intersects the end of the range', () => {
    const startTime = new Date(2023, 7, 25).getTime();
    const duration = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds
    const template = standardTemplate(startTime, duration);
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(1);
    expect(events[0].startTimestamp).toBe(template.eventType.startOn);
    expect(events[0].endTimestamp).toBe(template.eventType.startOn + template.eventType.duration);
  });

  test('event outside the range', () => {
    const startTime = new Date(2023, 8, 1).getTime();
    const duration = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
    const template = standardTemplate(startTime, duration);
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(0);
  });

  test('event exactly the same as the range', () => {
    const startTime = startRange.getTime();
    const duration = endRange.getTime() - startRange.getTime();
    const template = standardTemplate(startTime, duration);
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(1);
    expect(events[0].startTimestamp).toBe(template.eventType.startOn);
    expect(events[0].endTimestamp).toBe(template.eventType.startOn + template.eventType.duration);
  });
});
