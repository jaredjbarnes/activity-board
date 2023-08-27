import { useState } from "react";
import { DateTimeField } from "src/components/controls/date_time/date_time_field.tsx";
import { DateTimeFieldAdapter } from "src/components/controls/date_time/date_time_field_adapter.ts";

export default {
  title: "Controls/DateTimeField",
  component: DateTimeField,
};

export function Baseline() {
  const [adapter] = useState(() => {
    return new DateTimeFieldAdapter("Birthday", new Date(1982, 5, 11));
  });
  return <DateTimeField adapter={adapter} />;
}
