import { useState } from "react";
import { AxisAdapter } from "src/components/layouts/scroll/axis_adapter.ts";
import { IAxisPort } from "src/components/layouts/scroll/i_axis_port.ts";
import { SnapAxisAdapter } from "src/components/layouts/scroll/snap_axis_adapter.ts";
import { VScroll } from "src/components/layouts/scroll/v_scroll.tsx";

export default {
  title: "scroll/VScroll",
  component: VScroll,
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

export function DefaultVScroll() {
  const [axisAdapter] = useState(() => {
    return new AxisAdapter(requestAnimationFrame, cancelAnimationFrame);
  });

  function onTap(event: PointerEvent) {
    alert(`${event.pageY}`);
  }

  return (
    <VScroll
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
    </VScroll>
  );
}

export function MinMaxVScroll() {
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
    <VScroll
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
    </VScroll>
  );
}

export function SnapVScroll() {
  const [axisAdapter] = useState(() => {
    return new SnapAxisAdapter(100);
  });

  return (
    <VScroll
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
    </VScroll>
  );
}
