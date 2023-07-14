import React, { useEffect } from "react";
import { IAxisPort } from "./i_axis_port.ts";

export function useVerticalResizing(
  divRef: React.RefObject<HTMLDivElement | null>,
  axisAdapter: IAxisPort
) {
  useEffect(() => {
    const div = divRef.current;

    if (div == null) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry != null) {
        axisAdapter.setSize(entry.contentRect.height);
      }
    });

    observer.observe(div);

    const rect = div.getBoundingClientRect();
    axisAdapter.setSize(rect.width);

    return () => {
      observer.disconnect();
    };
  }, []);
}
