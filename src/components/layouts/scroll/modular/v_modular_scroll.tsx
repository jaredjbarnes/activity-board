import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useRef, useEffect } from "react";
import { ModularAxisAdapter } from "src/components/layouts/scroll/modular/modular_axis_adapter.ts";
import { IModularCell } from "src/components/layouts/scroll/modular/i_modular_cell.ts";
import { useVerticalPanning } from "src/components/layouts/scroll/use_vertical_panning.ts";
import { useVerticalResizing } from "src/components/layouts/scroll/use_vertical_resizing.ts";
import { usePreventNativeScrolling } from "src/components/layouts/scroll/usePreventNativeScrolling.ts";

export interface VModularScrollProps {
  children: (
    dateCell: IModularCell,
    axis: ModularAxisAdapter,
    index: number
  ) => React.ReactNode;
  adapter: ModularAxisAdapter;
  className?: string;
  style?: React.CSSProperties;
  overflow?: "hidden" | "visible";
  width?: string | number;
  height?: string | number;
}

export function VModularScroll({
  adapter: modularAxisAdapter,
  children: renderCell,
  style,
  className,
  width = "100%",
  height = "100%",
  overflow = "visible",
}: VModularScrollProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const cells = modularAxisAdapter.getVisibleCells();

  useAsyncValue(modularAxisAdapter.offsetBroadcast);
  useAsyncValue(modularAxisAdapter.sizeBroadcast);
  useVerticalResizing(divRef, modularAxisAdapter);
  useVerticalPanning(divRef, modularAxisAdapter);
  usePreventNativeScrolling(divRef);

  useEffect(() => {
    modularAxisAdapter.initialize(modularAxisAdapter.offset);
  }, [modularAxisAdapter]);

  return (
    <div
      ref={divRef}
      style={{
        height,
        width,
        ...style,
        position: "relative",
        userSelect: "none",
        touchAction: "none",
        overflow,
      }}
      className={className}
    >
      {cells.map((c, index) => renderCell(c, modularAxisAdapter, index))}
    </div>
  );
}
