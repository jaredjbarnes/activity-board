import React from "react";
import { VStack } from "src/components/layouts/stacks/v_stack/index.tsx";

export interface RightArrowProps {
  color?: string;
  position?: "start" | "center" | "end";
  offset?: number;
}

export const RightArrow = React.forwardRef(function RightArrow(
  { color = "white", position = "center", offset = 0 }: RightArrowProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <VStack
      ref={ref}
      width="10px"
      verticalAlignment={position}
      horizontalAlignment="center"
      style={{
        position: "absolute",
        top: `${offset}px`,
        right: "-9px",
      }}
    >
      <div
        style={{
          display: "inline-block",
          clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
          transform: "rotate(90deg)",
          transformOrigin: "center center",
          backgroundColor: color,
          width: "25px",
          height: "10px",
        }}
      ></div>
    </VStack>
  );
});
