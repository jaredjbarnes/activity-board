import { IEventAlteration } from "./models/event_template_types/i_event_alteration.ts";
import { IYearlyRecurringEventType } from "./models/event_template_types/i_yearly_event_type.ts";
import { IStandardEventType } from "./models/event_template_types/i_standard_event_type.ts";
import { IWeekOfMonthEventType } from "./models/event_template_types/i_week_of_month_event_type.ts";
import { IDaysOfWeekEventType } from "./models/event_template_types/i_days_of_week_event_type.ts";
import { IAnchoredEventType } from "./models/event_template_types/i_anchored_event_type.ts";
import { IGeneratedEvent } from "./models/i_generated_event.ts";
import { IEventType } from "./models/i_event_type.ts";
import { IEventTemplate } from "./models/i_event_template.ts";
import { EventTypeName } from "./models/event_template_types/event_type_name.ts";
import { AlterationEventGenerator } from "./event_generators/alteration_event_generator.ts";
import { DaysOfWeekGenerator } from "./event_generators/days_of_week_generator.ts";
import { WeekOfMonthEventGenerator } from "./event_generators/week_of_month_generator.ts";
import { YearlyEventGenerator } from "./event_generators/yearly_event_generator.ts";
import { StandardEventGenerator } from "./event_generators/standard_event_generator.ts";

type EventTemplate = IEventTemplate<IAnchoredEventType | IStandardEventType | IWeekOfMonthEventType | IDaysOfWeekEventType | IYearlyRecurringEventType>;

// Delta template type for partial updates - only id is required
type EventTemplateDelta = Partial<Omit<EventTemplate, 'id'>> & { id: string };

export interface EventGeneratorPort {
    getEventTemplates(startDate: Date, endDate: Date): Promise<EventTemplate[]>;
    removeEventTemplate(templateId: string): Promise<void>;
    updateEventTemplate(template: EventTemplateDelta): Promise<void>;
    addEventTemplate(template: EventTemplate): Promise<void>;
    getAlterations(startDate: Date, endDate: Date): Promise<IEventAlteration[]>;
    alterEvent(alteration: IEventAlteration): Promise<void>;
}

export class EventGenerator {
    private port: EventGeneratorPort;
    private alterationEventGenerator: AlterationEventGenerator;
    private dayOfWeekEventGenerator: DaysOfWeekGenerator;
    private weekOfMonthEventGenerator: WeekOfMonthEventGenerator;
    private yearlyEventGenerator: YearlyEventGenerator;
    private standardEventGenerator: StandardEventGenerator;
    
    constructor(port: EventGeneratorPort) {
        this.port = port;
        this.alterationEventGenerator = new AlterationEventGenerator();
        this.dayOfWeekEventGenerator = new DaysOfWeekGenerator();
        this.weekOfMonthEventGenerator = new WeekOfMonthEventGenerator();
        this.yearlyEventGenerator = new YearlyEventGenerator();
        this.standardEventGenerator = new StandardEventGenerator();
    }

    async getEvents(startDate: Date, endDate: Date): Promise<IGeneratedEvent<IEventType>[]> {
        const eventTemplates = await this.port.getEventTemplates(startDate, endDate);
        const alterations = await this.port.getAlterations(startDate, endDate);

        // Create a map of timestamps to alterations for fast lookup
        const alterationsMap = new Map<number, IEventAlteration[]>();
        alterations.forEach(alteration => {
            const existing = alterationsMap.get(alteration.generatedEventTimestamp) || [];
            existing.push(alteration);
            alterationsMap.set(alteration.generatedEventTimestamp, existing);
        });

        const events = [];
        eventTemplates.forEach(template => {
            let generatedEvents: IGeneratedEvent<IEventType>[] = [];
            
            // Use the appropriate generator based on the event type
            switch (template.eventType.name) {
                case EventTypeName.Standard:
                    generatedEvents = this.standardEventGenerator.generate(template as IEventTemplate<IStandardEventType>, startDate, endDate);
                    break;
                case EventTypeName.DayOfWeek:
                    generatedEvents = this.dayOfWeekEventGenerator.generate(template as IEventTemplate<IDaysOfWeekEventType>, startDate, endDate, alterationsMap);
                    break;
                case EventTypeName.WeekOfMonth:
                    generatedEvents = this.weekOfMonthEventGenerator.generate(template as IEventTemplate<IWeekOfMonthEventType>, startDate, endDate, alterationsMap);
                    break;
                case EventTypeName.Yearly:
                    generatedEvents = this.yearlyEventGenerator.generate(template as IEventTemplate<IYearlyRecurringEventType>, startDate, endDate, alterationsMap);
                    break;
            }
            
            events.push(...generatedEvents);
        });

        // Add alteration events
        this.alterationEventGenerator.setAlterations(alterations);
        const alterationEvents = this.alterationEventGenerator.generate(startDate, endDate, this._makeTemplatesMap(eventTemplates));
        events.push(...alterationEvents);

        return events;
    }

    private _makeTemplatesMap(templates: EventTemplate[]): Map<string, EventTemplate> {
        const map = new Map<string, EventTemplate>();
        templates.forEach(template => {
            map.set(template.id, template);
        });
        return map;
    }
}