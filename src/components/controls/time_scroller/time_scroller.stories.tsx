import { useState } from "react";
import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";
import { TimeScroller } from "src/components/controls/time_scroller/time_scroller.tsx";

export default {
  title: "controls/Time Scroller",
};

export function Example() {
  const [adapter] = useState(() => {
    return new TimeFieldAdapter("Time", 12 * 1000 * 60 * 60);
  });
  return <TimeScroller adapter={adapter} />;
}
