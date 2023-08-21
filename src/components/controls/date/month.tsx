import { IModularCell } from "src/components/layouts/scroll/modular/i_modular_cell.ts";

export interface MonthProps {
  cell: IModularCell;
}

const monthMap: Record<number, string> = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
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
