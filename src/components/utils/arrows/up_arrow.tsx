import React from "react";
import { HStack } from "src/components/layouts/stacks/h_stack/index.tsx";

export interface UpArrowProps {
  color?: string;
  position?: "start" | "center" | "end";
  offset?: number;
}

export const UpArrow = React.forwardRef(function UpArrow(
  { color = "white", position = "center", offset = 0 }: UpArrowProps,
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
        top: "-9px",
        left: `${offset}px`,
      }}
    >
      <div
        style={{
          display: "inline-block",
          clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
          backgroundColor: color,
          width: "25px",
          height: "10px",
        }}
      ></div>
    </HStack>
  );
});
