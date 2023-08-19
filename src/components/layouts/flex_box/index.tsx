import React, { HTMLAttributes, useLayoutEffect, useRef } from "react";
import { useForkRef } from "src/components/utils/hooks/use_fork_ref.ts";
export interface FlexBoxProps extends HTMLAttributes<HTMLElement> {
  fillSpaceWeight?: number;
  overflow?: "visible" | "auto" | "scroll" | "hidden";
  padding?: string;
  boxShadow?: string;
  background?: string;
  backgroundColor?: string;
  backgroundSize?: string;
  backgroundImage?: string;
  backgroundRepeat?: string;
  border?: string;
  borderRadius?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  opacity?: number;
  zIndex?: number;
  transform?: string;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}
export const FlexBox = React.forwardRef(function FillBox(
  {
    overflow = "visible",
    children,
    fillSpaceWeight = 1,
    style = {},
    className,
    padding,
    boxShadow,
    background,
    borderRadius,
    border,
    opacity,
    transform,
    ...props
  }: FlexBoxProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const fillBoxRef = useRef<HTMLDivElement | null>(null);
  const forkedRef = useForkRef(ref, fillBoxRef);
  useLayoutEffect(() => {
    const element = fillBoxRef.current;
    if (element != null) {
      // This is faster than getComputedStyle. And we know how the parents style is set.
      // This approach has its cons, but its fast. getComputedStyle causes a style recalc.
      const isRow = element.parentElement?.style.flexDirection === "row";
      if (isRow) {
        element.style.width = "auto";
        element.style.height = "100%";
        element.style.flexGrow = `${fillSpaceWeight}`;
        element.style.flexShrink = `${fillSpaceWeight}`;
        element.style.flexBasis = "0%";
      } else {
        element.style.width = "100%";
        element.style.height = "auto";
        element.style.flexGrow = `${fillSpaceWeight}`;
        element.style.flexShrink = `${fillSpaceWeight}`;
        element.style.flexBasis = "0%";
      }
    }
  }, [fillSpaceWeight]);
  return (
    <div
      ref={forkedRef}
      style={{
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          padding,
          boxShadow,
          background,
          borderRadius,
          border,
          opacity,
          transform,
          ...style,
          overflow,
          position: "absolute",
          top: "0px",
          left: "0px",
          bottom: "0px",
          right: "0px",
        }}
        className={className}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});
