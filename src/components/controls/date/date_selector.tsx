import { DateFieldAdapter } from "src/components/controls/date/date_field_adapter.ts";
import { DateScroller } from "src/components/controls/date_scroller/date_scroller.tsx";
import { UpArrow } from "src/components/utils/arrows/up_arrow.tsx";

export interface DateSelectorProps {
  adapter: DateFieldAdapter;
}

export function DateSelector({ adapter }: DateSelectorProps) {
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
      <DateScroller adapter={adapter} />
      <UpArrow />
    </div>
  );
}
