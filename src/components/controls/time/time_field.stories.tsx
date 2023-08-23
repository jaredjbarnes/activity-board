import { useState } from "react";
import { TimeField } from "src/components/controls/time/time_field.tsx";
import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";

export default {
  title: "Controls/TimeField",
  component: TimeField,
};

export function Baseline() {
  const [adapter] = useState(() => {
    return new TimeFieldAdapter("Time", 0);
  });
  return <TimeField adapter={adapter} />;
}
