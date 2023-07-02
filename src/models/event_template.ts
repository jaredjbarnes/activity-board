import { EventTemplateType } from "src/models/event_template_type.ts";
import { Activity } from "src/models/event_template_types/activity.ts";

export interface EventTemplate<T extends EventTemplateType> {
  id: string;
  type: T;
  activity: Activity | null;
  label: string;
  notes: string;
  iconName: string;
  start: number;
  end: number | null;
  createdOn: number;
  updatedOn: number;
  deletedOn: number | null;
}
