import { useState } from "react";
import { DateAxisAdapter } from "src/layouts/scroll/date_axis_adapter.ts";
import { VDateScroll } from "src/layouts/scroll/v_date_scroll.tsx";

export default {
  title: "Scroll/VDateScroll",
  component: VDateScroll,
};

export function DefaultVDateScroll() {
  const [dateAxisAdapter] = useState(() => {
    return new DateAxisAdapter(requestAnimationFrame, cancelAnimationFrame);
  });

  return (
    <VDateScroll
      dateAxisAdapter={dateAxisAdapter}
      onDateTap={(date) => {
        alert(date);
      }}
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
            {cell.date.toString()}
          </div>
        );
      }}
    </VDateScroll>
  );
}

export function MinMaxVDateScroll() {
  const [dateAxisAdapter] = useState(() => {
    const axisAdapter = new DateAxisAdapter(
      requestAnimationFrame,
      cancelAnimationFrame
    );
    axisAdapter.max = 500;
    axisAdapter.min = 0;
    return axisAdapter;
  });

  return (
    <VDateScroll
      dateAxisAdapter={dateAxisAdapter}
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
            {cell.date.toString()}
          </div>
        );
      }}
    </VDateScroll>
  );
}
