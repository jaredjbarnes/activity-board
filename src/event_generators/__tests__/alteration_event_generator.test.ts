import { AlterationEventGenerator } from "../alteration_event_generator.ts";
import { IEventAlteration, EventAlterationType } from "src/models/event_template_types/i_event_alteration.ts";
import { IEventTemplate } from "src/models/i_event_template.ts";
import { IAnchoredEventType } from "src/models/event_template_types/i_anchored_event_type.ts";
import { EventTypeName } from "src/models/event_template_types/event_type_name.ts";

describe("AlterationEventGenerator", () => {
  let generator: AlterationEventGenerator;
  let alterations: IEventAlteration[];
  let templates: Map<string, IEventTemplate<IAnchoredEventType>>;
  let template: IEventTemplate<IAnchoredEventType>;

  beforeEach(() => {
    template = {
      id: "template-1",
      title: "Test Template",
      notes: "Test notes",
      eventType: {
        name: EventTypeName.Anchored,
        anchorDate: new Date("2024-01-01T10:00:00Z"),
        interval: 86400000, // 1 day in milliseconds
        startTime: 36000000, // 10:00 AM in milliseconds
        duration: 3600000, // 1 hour
        startOn: new Date("2024-01-01T00:00:00Z").getTime(),
        endOn: null,
      } as IAnchoredEventType,
    };

    const template2: IEventTemplate<IAnchoredEventType> = {
      id: "template-2",
      title: "Test Template 2",
      notes: "Test notes 2",
      eventType: {
        name: EventTypeName.Anchored,
        anchorDate: new Date("2024-01-01T10:00:00Z"),
        interval: 86400000, // 1 day in milliseconds
        startTime: 36000000, // 10:00 AM in milliseconds
        duration: 3600000, // 1 hour
        startOn: new Date("2024-01-01T00:00:00Z").getTime(),
        endOn: null,
      } as IAnchoredEventType,
    };

    templates = new Map([
      ["template-1", template],
      ["template-2", template2],
    ]);

    alterations = [
      {
        id: "alteration-1",
        type: EventAlterationType.Reschedule,
        eventName: EventTypeName.Anchored,
        templateId: "template-1",
        generatedEventTimestamp: new Date("2024-01-01T10:00:00Z").getTime(),
        startTimestamp: new Date("2024-01-02T14:00:00Z").getTime(),
        duration: 3600000, // 1 hour
      },
      {
        id: "alteration-2",
        type: EventAlterationType.Cancel,
        eventName: EventTypeName.Anchored,
        templateId: "template-1",
        generatedEventTimestamp: new Date("2024-01-03T10:00:00Z").getTime(),
        startTimestamp: new Date("2024-01-03T10:00:00Z").getTime(),
        duration: 3600000, // 1 hour
      },
      {
        id: "alteration-3",
        type: EventAlterationType.Reschedule,
        eventName: EventTypeName.Anchored,
        templateId: "template-2", // Different template
        generatedEventTimestamp: new Date("2024-01-04T10:00:00Z").getTime(),
        startTimestamp: new Date("2024-01-04T14:00:00Z").getTime(),
        duration: 3600000, // 1 hour
      },
    ];

    generator = new AlterationEventGenerator(templates);
    generator.setAlterations(alterations);
  });

  describe("generate", () => {
    it("should generate events from rescheduled alterations", () => {
      const startDate = new Date("2024-01-01T00:00:00Z");
      const endDate = new Date("2024-01-05T23:59:59Z");

      const events = generator.generate(startDate, endDate);

      expect(events).toHaveLength(2);
      
      // Check template-1 event
      const template1Event = events.find(e => e.template.id === "template-1");
      expect(template1Event).toBeDefined();
      expect(template1Event!.template.title).toBe("Test Template");
      expect(template1Event!.template.notes).toBe("Test notes");
      expect(template1Event!.startTimestamp).toBe(new Date("2024-01-02T14:00:00Z").getTime());
      expect(template1Event!.endTimestamp).toBe(new Date("2024-01-02T15:00:00Z").getTime());
      expect(template1Event!.generatedTimestamp).toBe(new Date("2024-01-01T10:00:00Z").getTime());
      
      // Check template-2 event
      const template2Event = events.find(e => e.template.id === "template-2");
      expect(template2Event).toBeDefined();
      expect(template2Event!.template.title).toBe("Test Template 2");
      expect(template2Event!.template.notes).toBe("Test notes 2");
      expect(template2Event!.startTimestamp).toBe(new Date("2024-01-04T14:00:00Z").getTime());
      expect(template2Event!.endTimestamp).toBe(new Date("2024-01-04T15:00:00Z").getTime());
      expect(template2Event!.generatedTimestamp).toBe(new Date("2024-01-04T10:00:00Z").getTime());
    });

    it("should not include cancelled events", () => {
      const startDate = new Date("2024-01-01T00:00:00Z");
      const endDate = new Date("2024-01-05T23:59:59Z");

      const events = generator.generate(startDate, endDate);

      // Should include both rescheduled events, but not the cancelled one
      expect(events).toHaveLength(2);
      
      // Verify that the cancelled event (Jan 3rd) is not included
      const cancelledEvent = events.find(e => e.startTimestamp === new Date("2024-01-03T10:00:00Z").getTime());
      expect(cancelledEvent).toBeUndefined();
      
      // Verify that the rescheduled events are included
      const rescheduledEvent1 = events.find(e => e.startTimestamp === new Date("2024-01-02T14:00:00Z").getTime());
      expect(rescheduledEvent1).toBeDefined();
      
      const rescheduledEvent2 = events.find(e => e.startTimestamp === new Date("2024-01-04T14:00:00Z").getTime());
      expect(rescheduledEvent2).toBeDefined();
    });

    it("should include alterations for all templates in the date range", () => {
      const startDate = new Date("2024-01-01T00:00:00Z");
      const endDate = new Date("2024-01-05T23:59:59Z");

      const events = generator.generate(startDate, endDate);

      // Should include alterations for both template-1 and template-2
      expect(events).toHaveLength(2);
      expect(events[0].template.id).toBe("template-1");
      expect(events[1].template.id).toBe("template-2");
    });

    it("should filter alterations outside the date range", () => {
      const startDate = new Date("2024-01-03T00:00:00Z");
      const endDate = new Date("2024-01-03T23:59:59Z");

      const events = generator.generate(startDate, endDate);

      // Should not include the rescheduled event on Jan 2nd as it's outside the range
      expect(events).toHaveLength(0);
    });

    it("should handle empty alterations array", () => {
      const emptyGenerator = new AlterationEventGenerator(templates);
      const startDate = new Date("2024-01-01T00:00:00Z");
      const endDate = new Date("2024-01-05T23:59:59Z");

      const events = emptyGenerator.generate(startDate, endDate);

      expect(events).toHaveLength(0);
    });

    it("should not generate events when template is not found", () => {
      const alterationsWithMissingTemplate = [
        {
          id: "alteration-missing",
          type: EventAlterationType.Reschedule,
          eventName: EventTypeName.Anchored,
          templateId: "missing-template",
          generatedEventTimestamp: new Date("2024-01-01T10:00:00Z").getTime(),
          startTimestamp: new Date("2024-01-02T14:00:00Z").getTime(),
          duration: 3600000, // 1 hour
        },
      ];

      const generatorWithMissingTemplate = new AlterationEventGenerator(templates);
      generatorWithMissingTemplate.setAlterations(alterationsWithMissingTemplate);
      const startDate = new Date("2024-01-01T00:00:00Z");
      const endDate = new Date("2024-01-05T23:59:59Z");

      const events = generatorWithMissingTemplate.generate(startDate, endDate);

      expect(events).toHaveLength(0);
    });
  });
});
