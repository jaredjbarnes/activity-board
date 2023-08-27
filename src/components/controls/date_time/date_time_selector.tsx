import { DateTimeFieldAdapter } from "src/components/controls/date_time/date_time_field_adapter.ts";
import { DateTimeScroller } from "src/components/controls/date_time_scroller/date_time_scroller.tsx";
import { UpArrow } from "src/components/utils/arrows/up_arrow.tsx";

export interface DateTimeSelectorProps {
  adapter: DateTimeFieldAdapter;
}

export function DateTimeSelector({ adapter }: DateTimeSelectorProps) {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        padding: "8px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 0px 30px rgba(0,0,0,0.25)",
      }}
    >
      <DateTimeScroller
        dateFieldAdapter={adapter.dateFieldAdapter}
        timeFieldAdapter={adapter.timeFieldAdapter}
      />
      <UpArrow />
    </div>
  );
}
