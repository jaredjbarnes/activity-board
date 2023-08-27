import React from "react";
import { DateFieldAdapter } from "src/components/controls/date/date_field_adapter.ts";
import { DateScroller } from "src/components/controls/date_scroller/date_scroller.tsx";
import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";
import { TimeScroller } from "src/components/controls/time_scroller/time_scroller.tsx";

export interface DateTimeScrollerProps {
  dateFieldAdapter: DateFieldAdapter;
  timeFieldAdapter: TimeFieldAdapter;
}

export const DateTimeScroller = React.forwardRef(function DateTimeScroller(
  { dateFieldAdapter, timeFieldAdapter }: DateTimeScrollerProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div style={{ display: "inline-block", position: "relative" }} ref={ref}>
      <DateScroller adapter={dateFieldAdapter} />
      <br />
      <TimeScroller adapter={timeFieldAdapter} />
    </div>
  );
});
