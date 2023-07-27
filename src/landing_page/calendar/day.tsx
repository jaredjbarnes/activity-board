import { IDateCell } from "src/layouts/scroll/date/i_date_cell.ts";
import { VStack } from "src/layouts/stacks/v_stack/index.tsx";

export interface DayProps {
  dateCell: IDateCell;
}

const dayOfWeekMap: Record<number, string> = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
  7: "SUN",
};

export function Day({ dateCell }: DayProps) {
  return (
    <VStack
      style={{
        position: "absolute",
        top: `${dateCell.position}px`,
        left: "0px",
        height: `${dateCell.size}px`,
        userSelect: "none",
      }}
    >
      <div className="day-of-week">{dayOfWeekMap[dateCell.date.getDay()]}</div>
      <div className="date-of-day">{dateCell.date.getDate()}</div>
    </VStack>
  );
}
