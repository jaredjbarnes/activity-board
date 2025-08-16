import { EventTypeName } from "./event_type_name.ts";

export enum EventAlterationType {
    Reschedule,
    Cancel,
}

export interface IEventAlteration {
    id: string;
    type: EventAlterationType;
    eventName: EventTypeName;
    templateId: string;
    generatedTimestamp: number; 
    startTimestamp: number;
    duration: number;
}