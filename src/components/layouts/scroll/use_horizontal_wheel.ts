import React, { useLayoutEffect } from "react";
import { IAxisPort } from "src/components/layouts/scroll/i_axis_port.ts";

export function useHorizontalWheel(
  divRef: React.RefObject<HTMLDivElement | null>,
  axisAdapter: IAxisPort
) {
  const div = divRef.current;

  useLayoutEffect(() => {
    if (div != null) {
      function onWheelChange(event: WheelEvent) {
        axisAdapter.offset += event.deltaX;
      }

      div.addEventListener("wheel", onWheelChange);

      return () => {
        div.removeEventListener("wheel", onWheelChange);
      };
    }
  }, [div]);
}
