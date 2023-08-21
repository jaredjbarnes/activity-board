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
    <VStack
      className="text-field date-selector"
      style={{
        width: "250px",
        height: "200px",
        overflow: "hidden",
      }}
    >
      <HStack height="50px"></HStack>
      <HStack height="100px" style={{ overflow: "hidden" }}>
        <Box width="100px">
          <VModularScroll modularAxisAdapter={adapter.monthAxis}>
            {(cell, _, index) => {
              return <Month key={index} cell={cell} />;
            }}
          </VModularScroll>
        </Box>
        <Box width="75px">
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
      <HStack height="50px"></HStack>
    </VStack>
  );
}
