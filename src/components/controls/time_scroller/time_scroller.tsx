import React from "react";
import { BottomScrollerVeil } from "src/components/controls/date_scroller/bottom_scroller_veil.tsx";
import { TopScrollerVeil } from "src/components/controls/date_scroller/top_scroller_veil.tsx";
import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";
import { Meridiem } from "src/components/controls/time_scroller/meridiem.tsx";
import { Time } from "src/components/controls/time_scroller/time.tsx";
import { Box } from "src/components/layouts/box/index.tsx";
import { VModularScroll } from "src/components/layouts/scroll/modular/v_modular_scroll.tsx";
import { VNumberScroll } from "src/components/layouts/scroll/number/v_number_scroll.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { Spacer } from "src/components/layouts/stacks/spacer.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";

export interface TimeScrollerProps {
  adapter: TimeFieldAdapter;
}

export const TimeScroller = React.forwardRef(function TimeScroller(
  { adapter }: TimeScrollerProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <div ref={ref} style={{ display: "inline-block", position: "relative" }}>
      <VStack
        className="text-field date-selector"
        style={{
          width: "250px",
          height: "142px",
          overflow: "hidden",
        }}
      >
        <HStack
          height="40px"
          verticalAlignment="center"
          horizontalAlignment="center"
        >
          Choose Time
        </HStack>
        <Box height="102px" className="input" style={{ overflow: "hidden" }}>
          <HStack
            height="34px"
            style={{ position: "absolute", top: "31px", left: "0px" }}
          >
            <Spacer />
            <VModularScroll width="50px" adapter={adapter.hourAxis}>
              {(cell, _, index) => {
                return <Time key={index} cell={cell} modulusValue="12" />;
              }}
            </VModularScroll>
            <HStack width="8px">:</HStack>
            <VModularScroll width="50px" adapter={adapter.minuteAxis}>
              {(cell, _, index) => {
                return <Time key={index} cell={cell} modulusValue="0" />;
              }}
            </VModularScroll>
            <Spacer width="8px" />
            <VNumberScroll width="50px" adapter={adapter.meridiemAxis}>
              {(cell, _, index) => {
                return <Meridiem key={index} cell={cell} />;
              }}
            </VNumberScroll>
            <Spacer />
          </HStack>
          <TopScrollerVeil />
          <BottomScrollerVeil />
        </Box>
      </VStack>
    </div>
  );
});
