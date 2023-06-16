import { EventType } from "src/models/event_type";

export interface Event {
  id: string;
  type: EventType;
  label: string;
  iconName: string;
  createdOn: number;
  updatedOn: number;
  deletedOn: number;
}
