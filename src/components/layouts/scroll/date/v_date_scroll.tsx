import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useRef, useEffect } from "react";
import { DateAxisAdapter } from "src/components/layouts/scroll/date/date_axis_adapter.ts";
import { IDateCell } from "src/components/layouts/scroll/date/i_date_cell.ts";
import { usePreventNativeScrolling } from "src/components/layouts/scroll/usePreventNativeScrolling.ts";
import { useVerticalPanning } from "src/components/layouts/scroll/use_vertical_panning.ts";
import { useVerticalResizing } from "src/components/layouts/scroll/use_vertical_resizing.ts";

export interface VDateScrollProps {
  children: (
    dateCell: IDateCell,
    axis: DateAxisAdapter,
    index: number
  ) => React.ReactNode;
  dateAxisAdapter: DateAxisAdapter;
  className?: string;
  style?: React.CSSProperties;
  overflow?: "hidden" | "visible";
  width?: string | number;
  height?: string | number;
}

export function VDateScroll({
  dateAxisAdapter,
  children: renderCell,
  style,
  className,
  overflow,
  width = "100%",
  height = "100%",
}: VDateScrollProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const cells = dateAxisAdapter.getVisibleCells();

  useAsyncValue(dateAxisAdapter.offsetBroadcast);
  useAsyncValue(dateAxisAdapter.sizeBroadcast);
  useVerticalResizing(divRef, dateAxisAdapter);
  useVerticalPanning(divRef, dateAxisAdapter);
  usePreventNativeScrolling(divRef);

  useEffect(() => {
    dateAxisAdapter.initialize(dateAxisAdapter.offset);
  }, [dateAxisAdapter]);

  return (
    <div
      ref={divRef}
      style={{
        width,
        height,
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
