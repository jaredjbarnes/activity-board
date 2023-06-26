import { EventTemplateType } from "src/models/event_template_type.ts";

export interface EventTemplate<T extends EventTemplateType> {
  id: string;
  type: T;
  label: string;
  notes: string;
  iconName: string;
  start: number;
  end: number | null;
  createdOn: number;
  updatedOn: number;
  deletedOn: number | null;
}
