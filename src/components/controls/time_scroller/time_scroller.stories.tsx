import { useState } from "react";
import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";
import { TimeScroller } from "src/components/controls/time_scroller/time_scroller.tsx";
import { hoursToMilliseconds } from "src/utils/time.ts";

export default {
  title: "controls/Time Scroller",
};

export function Example() {
  const [adapter] = useState(() => {
    return new TimeFieldAdapter("Time", hoursToMilliseconds(12));
  });
  return <TimeScroller adapter={adapter} />;
}
