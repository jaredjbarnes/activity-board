import React from "react";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";

export interface DownArrowProps {
  color?: string;
  position?: "start" | "center" | "end";
  offset?: number;
}

export const DownArrow = React.forwardRef(function DownArrow(
  { color = "white", position = "center", offset = 0 }: DownArrowProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <HStack
      ref={ref}
      height="10px"
      verticalAlignment="center"
      horizontalAlignment={position}
      style={{
        position: "absolute",
        bottom: "-9px",
        left: `${offset}px`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
          backgroundColor: color,
          transform: "rotate(180deg)",
          width: "25px",
          height: "10px",
        }}
      ></div>
    </HStack>
  );
});
