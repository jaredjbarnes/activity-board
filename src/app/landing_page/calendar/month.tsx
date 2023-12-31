import { Box } from "src/components/layouts/box/index.tsx";
import { IDateCell } from "src/components/layouts/scroll/date/i_date_cell.ts";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";

export interface MonthProps {
  dateCell: IDateCell;
}

const monthMap: Record<number, string> = {
  0: "JANUARY",
  1: "FEBRUARY",
  2: "MARCH",
  3: "APRIL",
  4: "MAY",
  5: "JUNE",
  6: "JULY",
  7: "AUGUST",
  8: "SEPTEMBER",
  9: "OCTOBER",
  10: "NOVEMBER",
  11: "DECEMBER",
};

export function Month({ dateCell }: MonthProps) {
  return (
    <VStack
      style={{
        position: "absolute",
        top: "0px",
        left: "0px",
        transform: `translate(${0}px, ${dateCell.position}px)`,
        height: `${dateCell.size}px`,
        userSelect: "none",
      }}
    >
      <Box height="41px" className="month">
        {monthMap[dateCell.date.getMonth()]}
      </Box>
      <Box height="36px" className="year">
        {dateCell.date.getFullYear()}
      </Box>
    </VStack>
  );
}
