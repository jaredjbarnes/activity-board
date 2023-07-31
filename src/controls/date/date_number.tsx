import { INumberCell } from "src/layouts/scroll/number/i_number_cell.ts";

export interface MonthProps {
  cell: INumberCell;
}

export function DateNumber({ cell }: MonthProps) {
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
      {cell.value + 1}
    </div>
  );
}
