import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useRef, useLayoutEffect } from "react";
import { IDateCell } from "src/components/layouts/scroll/date/i_date_cell.ts";
import { MonthAxisAdapter } from "src/components/layouts/scroll/month/month_axis_adapter.ts";
import { usePreventNativeScrolling } from "src/components/layouts/scroll/usePreventNativeScrolling.ts";
import { useVerticalPanning } from "src/components/layouts/scroll/use_vertical_panning.ts";
import { useVerticalResizing } from "src/components/layouts/scroll/use_vertical_resizing.ts";

export interface VMonthScrollProps {
  children: (
    dateCell: IDateCell,
    axis: MonthAxisAdapter,
    index: number
  ) => React.ReactNode;
  monthAxisAdapter: MonthAxisAdapter;
  className?: string;
  style?: React.CSSProperties;
  onDateTap?: (date: Date) => void;
  overflow?: "hidden" | "visible";
  width?: string | number;
  height?: string | number;
}

export function VMonthScroll({
  monthAxisAdapter,
  children: renderCell,
  style,
  className,
  overflow,
  width = "100%",
  height = "100%",
}: VMonthScrollProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const cells = monthAxisAdapter.getVisibleCells();

  useAsyncValue(monthAxisAdapter.offsetBroadcast);
  useAsyncValue(monthAxisAdapter.sizeBroadcast);
  useVerticalResizing(divRef, monthAxisAdapter);
  useVerticalPanning(divRef, monthAxisAdapter);
  usePreventNativeScrolling(divRef);

  useLayoutEffect(() => {
    monthAxisAdapter.initialize(monthAxisAdapter.offset);
  }, [monthAxisAdapter]);

  return (
    <div
      ref={divRef}
      style={{
        width,
        height,
        position: "relative",
        ...style,
        userSelect: "none",
        touchAction: "none",
        overflow,
      }}
      className={className}
    >
      {cells.map((c, index) => renderCell(c, monthAxisAdapter, index))}
    </div>
  );
}
