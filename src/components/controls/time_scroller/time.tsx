import { INumberCell } from "src/components/layouts/scroll/number/i_number_cell.ts";

export interface TimeProps {
  cell: INumberCell;
  modulusValue: string;
}

export function Time({ cell, modulusValue }: TimeProps) {
  const time =
    cell.value === 0
      ? modulusValue.padStart(2, "0")
      : cell.value.toString().padStart(2, "0");

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
      {time}
    </div>
  );
}
