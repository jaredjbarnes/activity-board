import React, { useEffect, useRef } from "react";
import { IAxisPort } from "./i_axis_port.ts";
import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import { useHorizontalResizing } from "src/layouts/scroll/use_horizontal_resizing.ts";
import { useHorizontalPanning } from "src/layouts/scroll/use_horizontal_panning.ts";
import "hammerjs";

export interface HScrollProps {
  children: (axis: IAxisPort) => React.ReactNode;
  axisAdapter: IAxisPort;
  style?: React.CSSProperties;
  className?: string;
  onTap?: (event: PointerEvent) => void;
  overflow?: "hidden" | "visible";
}

export function HScroll({
  axisAdapter,
  children,
  style,
  className,
  overflow = "hidden",
  onTap,
}: HScrollProps) {
  const divRef = useRef<HTMLDivElement | null>(null);

  useAsyncValue(axisAdapter.offsetBroadcast);
  useAsyncValue(axisAdapter.sizeBroadcast);
  useHorizontalResizing(divRef, axisAdapter);
  useHorizontalPanning(divRef, axisAdapter, onTap);

  useEffect(() => {
    axisAdapter.initialize(0);
  }, [axisAdapter]);

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
      {children(axisAdapter)}
    </div>
  );
}
