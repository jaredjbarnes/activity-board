import {useState } from "react";
import { NumberAxisAdapter } from "src/layouts/scroll/number/number_axis_adapter.ts";
import { VNumberScroll } from "src/layouts/scroll/number/v_number_scroll.tsx";

export default {
  title: "Scroll/Number/VNumberScroll",
  component: VNumberScroll,
};

export function DefaultVNumberScroll() {
  const [modularAxisAdapter] = useState(() => {
    return new NumberAxisAdapter();
  });

  return (
    <VNumberScroll
      numberAxisAdapter={modularAxisAdapter}
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
    </VNumberScroll>
  );
}

export function MinMaxVNumberScroll() {
  const [modularAxisAdapter] = useState(() => {
    const axis = new NumberAxisAdapter();
    axis.min = 0;
    axis.max = 500;
    return axis;
  });

  return (
    <VNumberScroll
      numberAxisAdapter={modularAxisAdapter}
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
    </VNumberScroll>
  );
}

export function StartAtValue() {
  const [modularAxisAdapter] = useState(() => {
    const axis = new NumberAxisAdapter();
    axis.scrollToValue(2023);
    return axis;
  });

  return (
    <VNumberScroll
      numberAxisAdapter={modularAxisAdapter}
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
    </VNumberScroll>
  );
}
