import React from "react";
import { DateFieldProps } from "src/components/controls/date/date_field.tsx";
import { DateFieldAdapter } from "src/components/controls/date/date_field_adapter.ts";
import { BottomScrollerVeil } from "src/components/controls/date_scroller/bottom_scroller_veil.tsx";
import { DateNumber } from "src/components/controls/date_scroller/date_number.tsx";
import { Month } from "src/components/controls/date_scroller/month.tsx";
import { TopScrollerVeil } from "src/components/controls/date_scroller/top_scroller_veil.tsx";
import { Year } from "src/components/controls/date_scroller/year.tsx";
import { Box } from "src/components/layouts/box/index.tsx";
import { VModularScroll } from "src/components/layouts/scroll/modular/v_modular_scroll.tsx";
import { VNumberScroll } from "src/components/layouts/scroll/number/v_number_scroll.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";

export interface DateScrollerProps {
  adapter: DateFieldAdapter;
}

export const DateScroller = React.forwardRef(function DateScroller(
  { adapter }: DateFieldProps,
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
          Choose Date
        </HStack>
        <Box height="102px" className="input" style={{ overflow: "hidden" }}>
          <HStack
            height="34px"
            style={{ position: "absolute", top: "31px", left: "0px" }}
          >
            <VModularScroll
              width="125px"
              adapter={adapter.monthAxis}
            >
              {(cell, _, index) => {
                return <Month key={index} cell={cell} />;
              }}
            </VModularScroll>
            <VModularScroll width="50px" adapter={adapter.dateAxis}>
              {(cell, _, index) => {
                return <DateNumber key={index} cell={cell} />;
              }}
            </VModularScroll>
            <VNumberScroll width="75px" adapter={adapter.yearAxis}>
              {(cell, _, index) => {
                return <Year key={index} cell={cell} />;
              }}
            </VNumberScroll>
          </HStack>
          <TopScrollerVeil />
          <BottomScrollerVeil />
        </Box>
      </VStack>
    </div>
  );
});
