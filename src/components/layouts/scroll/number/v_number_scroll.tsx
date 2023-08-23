import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useRef, useEffect } from "react";
import { NumberAxisAdapter } from "src/components/layouts/scroll/number/number_axis_adapter.ts";
import { INumberCell } from "src/components/layouts/scroll/number/i_number_cell.ts";
import { useVerticalPanning } from "src/components/layouts/scroll/use_vertical_panning.ts";
import { useVerticalResizing } from "src/components/layouts/scroll/use_vertical_resizing.ts";
import { usePreventNativeScrolling } from "src/components/layouts/scroll/usePreventNativeScrolling.ts";

export interface VNumberScrollProps {
  children: (
    dateCell: INumberCell,
    axis: NumberAxisAdapter,
    index: number
  ) => React.ReactNode;
  adapter: NumberAxisAdapter;
  className?: string;
  style?: React.CSSProperties;
  overflow?: "hidden" | "visible";
  width?: string | number;
  height?: string | number;
}

export function VNumberScroll({
  adapter: numberAxisAdapter,
  children: renderCell,
  style,
  className,
  overflow = "visible",
  width = "100%",
  height = "100%",
}: VNumberScrollProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const cells = numberAxisAdapter.getVisibleCells();

  useAsyncValue(numberAxisAdapter.offsetBroadcast);
  useAsyncValue(numberAxisAdapter.sizeBroadcast);
  useVerticalResizing(divRef, numberAxisAdapter);
  useVerticalPanning(divRef, numberAxisAdapter);
  usePreventNativeScrolling(divRef);

  useEffect(() => {
    numberAxisAdapter.initialize(numberAxisAdapter.offset);
  }, [numberAxisAdapter]);

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
      {cells.map((c, index) => renderCell(c, numberAxisAdapter, index))}
    </div>
  );
}
