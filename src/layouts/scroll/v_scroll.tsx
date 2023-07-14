import React, { useEffect, useRef } from "react";
import { useVerticalPanning } from "./use_vertical_panning.ts";
import { useVerticalResizing } from "./use_vertical_resizing.ts";
import { IAxisPort } from "./i_axis_port.ts";
import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import "hammerjs";

export interface VScrollProps {
  children: (axis: IAxisPort) => React.ReactNode;
  axisAdapter: IAxisPort;
  style?: React.CSSProperties;
  className?: string;
  onTap?: (event: PointerEvent) => void;
  overflow?: "hidden" | "visible";
}

export function VScroll({
  axisAdapter,
  children,
  style,
  className,
  overflow = "hidden",
  onTap,
}: VScrollProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  
  useAsyncValue(axisAdapter.offsetBroadcast);
  useAsyncValue(axisAdapter.sizeBroadcast);
  useVerticalResizing(divRef, axisAdapter);
  useVerticalPanning(divRef, axisAdapter, onTap);

  useEffect(() => {
    axisAdapter.initialize(0);
  }, [axisAdapter]);

  return (
    <div
      ref={divRef}
      onPointerDown={() => {
        axisAdapter.stop();
      }}
      style={{
        ...style,
        position: "relative",
        userSelect: "none",
        touchAction: "none",
        overflow,
      }}
      className={className}
    >
      {children(axisAdapter)}
    </div>
  );
}
