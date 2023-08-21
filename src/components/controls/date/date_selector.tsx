import { Button } from "src/components/controls/buttons/button.tsx";
import { DateFieldAdapter } from "src/components/controls/date/date_field_adapter.ts";
import { DateNumber } from "src/components/controls/date/date_number.tsx";
import { Month } from "src/components/controls/date/month.tsx";
import { Year } from "src/components/controls/date/year.tsx";
import { Box } from "src/components/layouts/box/index.tsx";
import { VModularScroll } from "src/components/layouts/scroll/modular/v_modular_scroll.tsx";
import { VNumberScroll } from "src/components/layouts/scroll/number/v_number_scroll.tsx";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";

export interface DateSelectorProps {
  adapter: DateFieldAdapter;
}

export function DateSelector({ adapter }: DateSelectorProps) {
  return (
    <div
      style={{
        display: "inline-block",
        padding: "8px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0px 0px 30px rgba(0,0,0,0.25)",
      }}
    >
      <VStack
        className="text-field date-selector"
        style={{
          width: "250px",
          height: "202px",
          overflow: "hidden",
        }}
      >
        <HStack
          height="50px"
          verticalAlignment="center"
          horizontalAlignment="center"
        >
          Choose Date
        </HStack>
        <Box height="102px" className="input" style={{overflow: "hidden" }}>
          <HStack
            height="34px"
            style={{ position: "absolute", top: "31px", left: "0px" }}
          >
            <Box width="125px">
              <VModularScroll modularAxisAdapter={adapter.monthAxis}>
                {(cell, _, index) => {
                  return <Month key={index} cell={cell} />;
                }}
              </VModularScroll>
            </Box>
            <Box width="50px">
              <VModularScroll modularAxisAdapter={adapter.dateAxis}>
                {(cell, _, index) => {
                  return <DateNumber key={index} cell={cell} />;
                }}
              </VModularScroll>
            </Box>
            <Box width="75px">
              <VNumberScroll numberAxisAdapter={adapter.yearAxis}>
                {(cell, _, index) => {
                  return <Year key={index} cell={cell} />;
                }}
              </VNumberScroll>
            </Box>
          </HStack>
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              height: "31px",
              width: "100%",
              boxSizing: "border-box",
              borderBottom: "1px solid black",
              backgroundColor: "rgba(255,255,255, 0.65)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(1px)",
              pointerEvents: "none",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "65px",
              left: "0",
              height: "34px",
              width: "100%",
              boxSizing: "border-box",
              borderTop: "1px solid black",
              backgroundColor: "rgba(255,255,255, 0.65)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(1px)",
              pointerEvents: "none",
            }}
          ></div>
        </Box>

        <HStack height="50px">
          <Button variant="tertiary" width="50%">
            Cancel
          </Button>
          <Button variant="tertiary" width="50%">
            Done
          </Button>
        </HStack>
      </VStack>
    </div>
  );
}
