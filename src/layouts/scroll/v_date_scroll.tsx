import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useRef, useEffect } from "react";
import { DateAxisAdapter } from "src/layouts/scroll/date_axis_adapter.ts";
import { IDateCell } from "src/layouts/scroll/i_date_cell.ts";
import { useVerticalPanning } from "src/layouts/scroll/use_vertical_panning.ts";
import { useVerticalResizing } from "src/layouts/scroll/use_vertical_resizing.ts";

export interface VDateScrollProps {
  children: (
    dateCell: IDateCell,
    axis: DateAxisAdapter,
    index: number
  ) => React.ReactNode;
  dateAxisAdapter: DateAxisAdapter;
  className?: string;
  style?: React.CSSProperties;
  onDateTap?: (date: Date) => void;
  overflow?: "hidden" | "visible";
}

export function VDateScroll({
  dateAxisAdapter,
  children: renderCell,
  style,
  className,
  overflow,
}: VDateScrollProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const cells = dateAxisAdapter.getVisibleCells();

  useAsyncValue(dateAxisAdapter.offsetBroadcast);
  useAsyncValue(dateAxisAdapter.sizeBroadcast);
  useVerticalResizing(divRef, dateAxisAdapter);
  useVerticalPanning(divRef, dateAxisAdapter);

  useEffect(() => {
    dateAxisAdapter.initialize(0);
  }, [dateAxisAdapter]);

  return (
    <div
      ref={divRef}
      style={{
        ...style,
        position: "relative",
        userSelect: "none",
        touchAction: "none",
        overflow,
      }}
      className={className}
    >
      {cells.map((c, index) => renderCell(c, dateAxisAdapter, index))}
    </div>
  );
}
