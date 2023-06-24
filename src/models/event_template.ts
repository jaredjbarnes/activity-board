import { EventTemplateType } from "src/models/event_template_type.ts";

export interface EventTemplate<T extends EventTemplateType> {
  id: string;
  type: T;
  label: string;
  notes: string;
  iconName: string;
  startOn: number;
  createdOn: number;
  updatedOn: number;
  deletedOn: number | null;
}
