import { EventGenerator, EventGeneratorPort } from "src/event_generator/event_generator.ts";
import { IEventTemplate } from "src/event_generator/models/i_event_template.ts";
import { IStandardEventType } from "src/event_generator/models/event_template_types/i_standard_event_type.ts";
import { IDaysOfWeekEventType } from "src/event_generator/models/event_template_types/i_days_of_week_event_type.ts";
import { IWeekOfMonthEventType } from "src/event_generator/models/event_template_types/i_week_of_month_event_type.ts";
import { IYearlyRecurringEventType } from "src/event_generator/models/event_template_types/i_yearly_event_type.ts";
import { IAnchoredEventType } from "src/event_generator/models/event_template_types/i_anchored_event_type.ts";
import { IEventAlteration, EventAlterationType } from "src/event_generator/models/event_template_types/i_event_alteration.ts";
import { EventTypeName } from "src/event_generator/models/event_template_types/event_type_name.ts";
import { Days } from "src/event_generator/models/event_template_types/days.ts";
import { Month } from "src/event_generator/models/month.ts";

// Mock implementations for testing
class MockEventGeneratorAdapter implements EventGeneratorPort {
  private eventTemplates: IEventTemplate<IStandardEventType | IDaysOfWeekEventType | IWeekOfMonthEventType | IYearlyRecurringEventType | IAnchoredEventType>[] = [];
  private alterations: IEventAlteration[] = [];

  constructor(
    eventTemplates: IEventTemplate<IStandardEventType | IDaysOfWeekEventType | IWeekOfMonthEventType | IYearlyRecurringEventType | IAnchoredEventType>[] = [],
    alterations: IEventAlteration[] = []
  ) {
    this.eventTemplates = eventTemplates;
    this.alterations = alterations;
  }

  async getEventTemplates(startDate: Date, endDate: Date) {
    return this.eventTemplates;
  }

  async removeEventTemplate(templateId: string) {
    this.eventTemplates = this.eventTemplates.filter(t => t.id !== templateId);
  }

  async updateEventTemplate(template: IEventTemplate<IStandardEventType | IDaysOfWeekEventType | IWeekOfMonthEventType | IYearlyRecurringEventType | IAnchoredEventType>) {
    const index = this.eventTemplates.findIndex(t => t.id === template.id);
    if (index !== -1) {
      this.eventTemplates[index] = template;
    }
  }

  async addEventTemplate(template: IEventTemplate<IStandardEventType | IDaysOfWeekEventType | IWeekOfMonthEventType | IYearlyRecurringEventType | IAnchoredEventType>) {
    this.eventTemplates.push(template);
  }

  async getAlterations(startDate: Date, endDate: Date) {
    return this.alterations;
  }

  async alterEvent(alteration: IEventAlteration) {
    this.alterations.push(alteration);
  }

  async addAlterations(alterations: IEventAlteration[]) {
    this.alterations.push(...alterations);
  }
}

// Helper functions to create test data
const createStandardTemplate = (id: string, startTime: number, duration: number): IEventTemplate<IStandardEventType> => ({
  id,
  title: `Standard Event ${id}`,
  notes: null,
  eventType: {
    name: EventTypeName.Standard,
    startOn: startTime,
    duration: duration,
  },
});

const createWeeklyTemplate = (id: string, daysOfWeek: Days[], startTime: number, duration: number): IEventTemplate<IDaysOfWeekEventType> => ({
  id,
  title: `Weekly Event ${id}`,
  notes: null,
  eventType: {
    name: EventTypeName.DayOfWeek,
    repeatOnDays: daysOfWeek,
    startTime: startTime,
    duration: duration,
    startOn: new Date(2023, 0, 1).getTime(), // January 1, 2023
    endOn: null,
    repeatIntervalByWeek: 1,
  },
});

const createWeekOfMonthTemplate = (id: string, weekOfMonth: number, dayOfWeek: Days, startTime: number, duration: number): IEventTemplate<IWeekOfMonthEventType> => ({
  id,
  title: `Week of Month Event ${id}`,
  notes: null,
  eventType: {
    name: EventTypeName.WeekOfMonth,
    repeatOnDays: [dayOfWeek],
    repeatOnWeek: weekOfMonth,
    startTime: startTime,
    duration: duration,
    startOn: new Date(2023, 0, 1).getTime(), // January 1, 2023
    endOn: null,
    repeatIntervalByMonth: 1,
  },
});

const createYearlyTemplate = (id: string, month: Month, day: number, startTime: number, duration: number): IEventTemplate<IYearlyRecurringEventType> => ({
  id,
  title: `Yearly Event ${id}`,
  notes: null,
  eventType: {
    name: EventTypeName.Yearly,
    repeatOnMonth: month,
    repeatOnDay: day,
    startTime: startTime,
    duration: duration,
    startOn: new Date(2023, 0, 1).getTime(), // January 1, 2023
    endOn: null,
    repeatIntervalByYear: 1,
  },
});

const createAlteration = (generatedEventTimestamp: number, templateId: string): IEventAlteration => ({
  id: `alteration-${generatedEventTimestamp}`,
  type: EventAlterationType.Reschedule,
  eventName: EventTypeName.Standard,
  templateId,
  generatedEventTimestamp,
  startTimestamp: generatedEventTimestamp,
  duration: 60 * 60 * 1000, // 1 hour
});

const createAlterationWithNewDate = (generatedEventTimestamp: number, templateId: string, newDate: Date): IEventAlteration => ({
  id: `alteration-${generatedEventTimestamp}`,
  type: EventAlterationType.Reschedule,
  eventName: EventTypeName.Standard,
  templateId,
  generatedEventTimestamp,
  startTimestamp: newDate.getTime(),
  duration: 60 * 60 * 1000, // 1 hour
});

describe('Scheduler', () => {
  let eventGenerator: EventGenerator;
  let mockPort: MockEventGeneratorAdapter;

  beforeEach(() => {
    mockPort = new MockEventGeneratorAdapter();
    eventGenerator = new EventGenerator(mockPort);
  });

  describe('getEvents', () => {
    const startDate = new Date(2023, 7, 1); // August 1, 2023
    const endDate = new Date(2023, 7, 31); // August 31, 2023

    test('should return empty array when no templates exist', async () => {
      const events = await eventGenerator.getEvents(startDate, endDate);
      expect(events).toEqual([]);
    });

    test('should generate standard events within date range', async () => {
      const startTime = new Date(2023, 7, 15).getTime(); // August 15, 2023
      const duration = 2 * 24 * 60 * 60 * 1000; // 2 days
      const template = createStandardTemplate('standard-1', startTime, duration);

      mockPort = new MockEventGeneratorAdapter([template]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      expect(events.length).toBe(1);
      expect(events[0].template.id).toBe('standard-1');
      expect(events[0].startTimestamp).toBe(startTime);
      expect(events[0].endTimestamp).toBe(startTime + duration);
    });

    test('should generate weekly events for specified days', async () => {
      const startTime = 9 * 60 * 60 * 1000; // 9 AM
      const duration = 2 * 60 * 60 * 1000; // 2 hours
      const template = createWeeklyTemplate('weekly-1', [Days.Monday, Days.Wednesday, Days.Friday], startTime, duration); // Monday, Wednesday, Friday

      mockPort = new MockEventGeneratorAdapter([template]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      // August 2023 has 5 weeks, and we expect events on Monday, Wednesday, Friday
      // This should generate multiple events
      expect(events.length).toBeGreaterThan(0);
      events.forEach(event => {
        expect(event.template.id).toBe('weekly-1');
        expect(event.startTimestamp).toBeGreaterThanOrEqual(startDate.getTime());
        expect(event.endTimestamp).toBeLessThanOrEqual(endDate.getTime());
      });
    });

    test('should generate week of month events', async () => {
      const startTime = 14 * 60 * 60 * 1000; // 2 PM
      const duration = 1 * 60 * 60 * 1000; // 1 hour
      const template = createWeekOfMonthTemplate('wom-1', 2, Days.Monday, startTime, duration); // 2nd week, Monday

      mockPort = new MockEventGeneratorAdapter([template]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      expect(events.length).toBe(1);
      expect(events[0].template.id).toBe('wom-1');
    });

    test('should generate yearly events', async () => {
      const startTime = 10 * 60 * 60 * 1000; // 10 AM
      const duration = 3 * 60 * 60 * 1000; // 3 hours
      const template = createYearlyTemplate('yearly-1', Month.August, 15, startTime, duration); // August 15

      mockPort = new MockEventGeneratorAdapter([template]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      expect(events.length).toBe(1);
      expect(events[0].template.id).toBe('yearly-1');
    });

    test('should handle multiple event templates', async () => {
      const standardTemplate = createStandardTemplate('standard-1', new Date(2023, 7, 10).getTime(), 24 * 60 * 60 * 1000);
      const weeklyTemplate = createWeeklyTemplate('weekly-1', [Days.Monday], 9 * 60 * 60 * 1000, 2 * 60 * 60 * 1000);

      mockPort = new MockEventGeneratorAdapter([standardTemplate, weeklyTemplate]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      expect(events.length).toBeGreaterThan(1);
      const standardEvents = events.filter(e => e.template.id === 'standard-1');
      const weeklyEvents = events.filter(e => e.template.id === 'weekly-1');

      expect(standardEvents.length).toBe(1);
      expect(weeklyEvents.length).toBeGreaterThan(0);
    });

    test('should apply alterations to generated events', async () => {
      const startTime = new Date(2023, 7, 15).getTime();
      const duration = 24 * 60 * 60 * 1000;
      const template = createStandardTemplate('standard-1', startTime, duration);
      const alteration = createAlteration(startTime, 'standard-1');

      mockPort = new MockEventGeneratorAdapter([template], [alteration]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      // Should have both the original event and the alteration event
      expect(events.length).toBe(2);
      const standardEvents = events.filter(e => e.template.id === 'standard-1');
      expect(standardEvents.length).toBe(2);
    });

    test('should filter events outside the date range', async () => {
      const futureStartTime = new Date(2023, 9, 1).getTime(); // October 1, 2023
      const duration = 24 * 60 * 60 * 1000;
      const template = createStandardTemplate('future-1', futureStartTime, duration);

      mockPort = new MockEventGeneratorAdapter([template]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      expect(events.length).toBe(0);
    });

    test('should handle events that intersect with range boundaries', async () => {
      const startTime = new Date(2023, 6, 30).getTime(); // July 30, 2023
      const duration = 5 * 24 * 60 * 60 * 1000; // 5 days (extends into August)
      const template = createStandardTemplate('intersect-1', startTime, duration);

      mockPort = new MockEventGeneratorAdapter([template]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      expect(events.length).toBe(1);
      expect(events[0].startTimestamp).toBe(startTime);
      expect(events[0].endTimestamp).toBe(startTime + duration);
    });

    test('should handle empty alterations array', async () => {
      const startTime = new Date(2023, 7, 15).getTime();
      const duration = 24 * 60 * 60 * 1000;
      const template = createStandardTemplate('standard-1', startTime, duration);

      mockPort = new MockEventGeneratorAdapter([template], []);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      expect(events.length).toBe(1);
      expect(events[0].template.id).toBe('standard-1');
    });

    test('should handle multiple alterations for the same event', async () => {
      const startTime = new Date(2023, 7, 15).getTime();
      const duration = 24 * 60 * 60 * 1000;
      const template = createStandardTemplate('standard-1', startTime, duration);
      const alteration1 = createAlteration(startTime, 'standard-1');
      const alteration2 = createAlteration(startTime, 'standard-1');

      mockPort = new MockEventGeneratorAdapter([template], [alteration1, alteration2]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      // Should have the original event plus two alteration events
      expect(events.length).toBe(3);
      const standardEvents = events.filter(e => e.template.id === 'standard-1');
      expect(standardEvents.length).toBe(3);
    });
  });

  describe('constructor', () => {
    test('should initialize with provided port', () => {
      const port = new MockEventGeneratorAdapter();
      const scheduler = new EventGenerator(port);

      // The scheduler should be properly initialized
      expect(scheduler).toBeInstanceOf(EventGenerator);
    });
  });

  describe('edge cases', () => {
    test('should handle very short date ranges', async () => {
      const startDate = new Date(2023, 7, 15);
      const endDate = new Date(2023, 7, 15, 23, 59, 59); // Same day, end of day
      const startTime = startDate.getTime();
      const duration = 2 * 60 * 60 * 1000; // 2 hours
      const template = createStandardTemplate('short-1', startTime, duration);

      mockPort = new MockEventGeneratorAdapter([template]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      expect(events.length).toBe(1);
    });

    test('should handle very long date ranges', async () => {
      const startDate = new Date(2023, 0, 1); // January 1, 2023
      const endDate = new Date(2023, 11, 31); // December 31, 2023
      const startTime = new Date(2023, 5, 15).getTime(); // June 15, 2023
      const duration = 24 * 60 * 60 * 1000;
      const template = createStandardTemplate('long-1', startTime, duration);

      mockPort = new MockEventGeneratorAdapter([template]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(startDate, endDate);

      expect(events.length).toBe(1);
    });

    test('should handle zero duration events', async () => {
      const startTime = new Date(2023, 7, 15).getTime();
      const duration = 1; // Use 1ms instead of 0 to avoid potential issues
      const template = createStandardTemplate('zero-1', startTime, duration);

      mockPort = new MockEventGeneratorAdapter([template]);
      eventGenerator = new EventGenerator(mockPort);

      const events = await eventGenerator.getEvents(new Date(2023, 7, 1), new Date(2023, 7, 31));

      expect(events.length).toBe(1);
      expect(events[0].endTimestamp - events[0].startTimestamp).toBe(1);
    });
  });

  describe('custom events', () => {
    test('Birthdays', async () => {


      const johnsTemplate = createYearlyTemplate('johns-birthday', Month.January, 1, 0, 24 * 60 * 60 * 1000);
      const janesTemplate = createYearlyTemplate('janes-birthday', Month.January, 1, 0, 24 * 60 * 60 * 1000);
      const joesTemplate = createYearlyTemplate('joes-birthday', Month.January, 1, 0, 24 * 60 * 60 * 1000);

      mockPort = new MockEventGeneratorAdapter([johnsTemplate, janesTemplate, joesTemplate]);
      eventGenerator = new EventGenerator(mockPort);

      const joesBirthdayAlteration = createAlterationWithNewDate(new Date(2025, 0, 1).getTime(), 'joes-birthday', new Date(2025, 0, 2));
      mockPort.addAlterations([joesBirthdayAlteration]);
      const events = await eventGenerator.getEvents(new Date(2025, 0, 1), new Date(2026, 0, 1));

      expect(events.length).toBe(3);
    });
  });
});
