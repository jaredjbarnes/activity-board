import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { DateTimeFieldAdapter } from "src/components/controls/date_time/date_time_field_adapter.ts";
import { DateTimeScroller } from "src/components/controls/date_time_scroller/date_time_scroller.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/components/layouts/stacks/spacer.tsx";
import { DownArrow } from "src/components/utils/arrows/down_arrow.tsx";
import { UpArrow } from "src/components/utils/arrows/up_arrow.tsx";

export interface DateTimeSelectorProps {
  adapter: DateTimeFieldAdapter;
}

export function DateTimeSelector({ adapter }: DateTimeSelectorProps) {
  const isUpArrow = adapter.popoverPresenter.anchorVerticalOrigin === "bottom";
  useAsyncValue(adapter.popoverPresenter.popoverPositionBroadcast);

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
      <HStack height="30px" style={{ fontSize: "20px" }}>
        Choose Date & Time
      </HStack>
      <Spacer height="8px" />
      <DateTimeScroller
        dateFieldAdapter={adapter.dateFieldAdapter}
        timeFieldAdapter={adapter.timeFieldAdapter}
      />
      {isUpArrow ? <UpArrow /> : <DownArrow />}
    </div>
  );
}
