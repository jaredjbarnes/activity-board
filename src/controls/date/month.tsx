import { IModularCell } from "src/layouts/scroll/modular/i_modular_cell.ts";

export interface MonthProps {
  cell: IModularCell;
}

const monthMap: Record<number, string> = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

export function Month({ cell }: MonthProps) {
  return (
    <div
      style={{
        display: "grid",
        position: "absolute",
        top: "0px",
        left: "0px",
        transform: `translate(${0}px, ${cell.position}px)`,
        height: `${cell.size}px`,
        width: "100%",
        placeItems: "center start",
      }}
    >
      {monthMap[cell.value]}
    </div>
  );
}
