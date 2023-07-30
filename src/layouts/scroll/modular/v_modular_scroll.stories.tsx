import { useState } from "react";
import { ModularAxisAdapter } from "src/layouts/scroll/modular/modular_axis_adapter.ts";
import { VModularScroll } from "src/layouts/scroll/modular/v_modular_scroll.tsx";

export default {
  title: "Scroll/Modular/VModularScroll",
  component: VModularScroll,
};

export function DefaultVModularScroll() {
  const [modularAxisAdapter] = useState(() => {
    return new ModularAxisAdapter(requestAnimationFrame, cancelAnimationFrame);
  });

  return (
    <VModularScroll
      modularAxisAdapter={modularAxisAdapter}
      style={{
        width: "100%",
        height: `100%`,
        border: "3px solid black",
        boxSizing: "border-box",
      }}
    >
      {(cell) => {
        return (
          <div
            style={{
              position: "absolute",
              top: `${cell.position}px`,
              left: "0px",
              height: `${cell.size}px`,
              border: "1px solid #000000",
              width: "100%",
            }}
          >
            {cell.value.toString()}
          </div>
        );
      }}
    </VModularScroll>
  );
}
