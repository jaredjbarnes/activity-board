import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";
import { TimeScroller } from "src/components/controls/time_scroller/time_scroller.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/components/layouts/stacks/spacer.tsx";
import { UpArrow } from "src/components/utils/arrows/up_arrow.tsx";

export interface TimeSelectorProps {
  adapter: TimeFieldAdapter;
}

export function TimeSelector({ adapter }: TimeSelectorProps) {
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
        Choose Time
      </HStack>
      <Spacer height="8px" />
      <TimeScroller adapter={adapter} />
      <UpArrow />
    </div>
  );
}
