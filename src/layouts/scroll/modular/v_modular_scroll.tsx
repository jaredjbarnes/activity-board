import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useRef, useEffect } from "react";
import { ModularAxisAdapter } from "src/layouts/scroll/modular/modular_axis_adapter.ts";
import { IModularCell } from "src/layouts/scroll/modular/i_modular_cell.ts";
import { useVerticalPanning } from "src/layouts/scroll/use_vertical_panning.ts";
import { useVerticalResizing } from "src/layouts/scroll/use_vertical_resizing.ts";

export interface VModularScrollProps {
  children: (
    dateCell: IModularCell,
    axis: ModularAxisAdapter,
    index: number
  ) => React.ReactNode;
  modularAxisAdapter: ModularAxisAdapter;
  className?: string;
  style?: React.CSSProperties;
  overflow?: "hidden" | "visible";
}

export function VModularScroll({
  modularAxisAdapter,
  children: renderCell,
  style,
  className,
  overflow,
}: VModularScrollProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const cells = modularAxisAdapter.getVisibleCells();

  useAsyncValue(modularAxisAdapter.offsetBroadcast);
  useAsyncValue(modularAxisAdapter.sizeBroadcast);
  useVerticalResizing(divRef, modularAxisAdapter);
  useVerticalPanning(divRef, modularAxisAdapter);

  useEffect(() => {
    modularAxisAdapter.initialize(0);
  }, [modularAxisAdapter]);

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
      {cells.map((c, index) => renderCell(c, modularAxisAdapter, index))}
    </div>
  );
}
