import { useState } from "react";
import { TimeField } from "src/components/controls/time/time_field.tsx";
import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";
import { hoursToMilliseconds } from "src/utils/time.ts";

export default {
  title: "Controls/TimeField",
  component: TimeField,
};

export function Baseline() {
  const [adapter] = useState(() => {
    return new TimeFieldAdapter("Time", hoursToMilliseconds(8));
  });
  return <TimeField adapter={adapter} />;
}
