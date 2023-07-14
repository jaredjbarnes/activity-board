import { useState } from "react";
import { AxisAdapter } from "src/layouts/scroll/axis_adapter.ts";
import { IAxisPort } from "src/layouts/scroll/i_axis_port.ts";
import { SnapAxisAdapter } from "src/layouts/scroll/snap_axis_adapter.ts";
import { HScroll } from "src/layouts/scroll/h_scroll.tsx";

export default {
  title: "scroll/HScroll",
  component: HScroll,
};

function AxisData({ axis }: { axis: IAxisPort }) {
  return (
    <div>
      <div>Start: {axis.start}</div>
      <div>End: {axis.end}</div>
      <div>Offset: {axis.offset}</div>
      <div>Size: {axis.size}</div>
    </div>
  );
}

export function DefaultHScroll() {
  const [axisAdapter] = useState(() => {
    return new AxisAdapter(requestAnimationFrame, cancelAnimationFrame);
  });

  function onTap(event: PointerEvent) {
    alert(`${event.pageY}`);
  }

  return (
    <HScroll
      axisAdapter={axisAdapter}
      onTap={onTap}
      style={{
        width: "100%",
        height: `100%`,
        border: "3px solid black",
        boxSizing: "border-box",
      }}
    >
      {(axisAdapter) => {
        return <AxisData axis={axisAdapter} />;
      }}
    </HScroll>
  );
}

export function MinMaxHScroll() {
  const [axisAdapter] = useState(() => {
    const axisAdapter = new AxisAdapter(
      requestAnimationFrame,
      cancelAnimationFrame
    );
    axisAdapter.max = 500;
    axisAdapter.min = 0;
    return axisAdapter;
  });

  return (
    <HScroll
      axisAdapter={axisAdapter}
      style={{
        width: "100%",
        height: `100%`,
        border: "3px solid black",
        boxSizing: "border-box",
      }}
    >
      {(axisAdapter) => {
        return <AxisData axis={axisAdapter} />;
      }}
    </HScroll>
  );
}

export function SnapHScroll() {
  const [axisAdapter] = useState(() => {
    return new SnapAxisAdapter(
      requestAnimationFrame,
      cancelAnimationFrame,
      100
    );
  });

  return (
    <HScroll
      axisAdapter={axisAdapter}
      style={{
        width: "100%",
        height: `100%`,
        border: "3px solid black",
        boxSizing: "border-box",
      }}
    >
      {(axisAdapter) => {
        return <AxisData axis={axisAdapter} />;
      }}
    </HScroll>
  );
}
