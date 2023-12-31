import { INumberCell } from "src/components/layouts/scroll/number/i_number_cell.ts";

export interface MonthProps {
  cell: INumberCell;
}

export function Year({ cell }: MonthProps) {
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
        placeItems: "center center",
      }}
    >
      {cell.value}
    </div>
  );
}
