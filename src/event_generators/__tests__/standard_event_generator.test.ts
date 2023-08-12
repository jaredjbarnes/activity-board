import { IStandardEventType } from "src/models/event_template_types/i_standard_event_type.ts";
import { EventTypeName } from "src/models/event_type_name.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { StandardEventGenerator } from "src/event_generators/standard_event_generator.ts";


const standardTemplate = (start: number, end: number): IEventTemplate<IStandardEventType> => {
  return {
    id: "test-id",
    title: "Test Event",
    notes: null,
    eventType: {
      name: EventTypeName.Standard,
      startOn: start,
      endOn: end,
    },
  };
};

describe('StandardEventGenerator', () => {
  const generator = new StandardEventGenerator();
  const startRange = new Date(2023, 7, 1);
  const endRange = new Date(2023, 7, 31);

  test('event within the range', () => {
    const template = standardTemplate(new Date(2023, 7, 5).getTime(), new Date(2023, 7, 10).getTime());
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(1);
    expect(events[0].startTimestamp).toBe(template.eventType.startOn);
    expect(events[0].endTimestamp).toBe(template.eventType.endOn);
  });

  test('event intersects the start of the range', () => {
    const template = standardTemplate(new Date(2023, 6, 25).getTime(), new Date(2023, 7, 10).getTime());
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(1);
    expect(events[0].startTimestamp).toBe(template.eventType.startOn);
    expect(events[0].endTimestamp).toBe(template.eventType.endOn);
  });

  test('event intersects the end of the range', () => {
    const template = standardTemplate(new Date(2023, 7, 25).getTime(), new Date(2023, 8, 5).getTime());
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(1);
    expect(events[0].startTimestamp).toBe(template.eventType.startOn);
    expect(events[0].endTimestamp).toBe(template.eventType.endOn);
  });

  test('event outside the range', () => {
    const template = standardTemplate(new Date(2023, 8, 1).getTime(), new Date(2023, 8, 5).getTime());
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(0);
  });

  test('event exactly the same as the range', () => {
    const template = standardTemplate(startRange.getTime(), endRange.getTime());
    const events = generator.generate(template, startRange, endRange);
    expect(events.length).toBe(1);
    expect(events[0].startTimestamp).toBe(template.eventType.startOn);
    expect(events[0].endTimestamp).toBe(template.eventType.endOn);
  });
});
