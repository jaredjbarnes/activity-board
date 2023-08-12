import React, { useLayoutEffect } from "react";
import { IPointerPort } from "./i_pointer_port.ts";
import "hammerjs";

declare var Hammer: any;

export function useVerticalPanning(
  divRef: React.RefObject<HTMLDivElement | null>,
  pointerAdapter: IPointerPort,
  onTap?: (event: PointerEvent) => void
) {
  const div = divRef.current;

  useLayoutEffect(() => {
    if (div != null) {
      const manager = new Hammer.Manager(div);
      manager.domEvents = true;

      manager.add(
        new Hammer.Pan({ direction: Hammer.DIRECTION_VERTICAL, threshold: 5 })
      );

      manager.add(new Hammer.Tap());

      manager.on("tap", (e: any) => {
        pointerAdapter.pointerStart(e.center.y);
        pointerAdapter.pointerMove(e.center.y);
        pointerAdapter.pointerEnd();

        onTap && onTap(e.srcEvent);
      });

      manager.on("panstart", (e: any) => {
        pointerAdapter.pointerStart(e.center.y);
        pointerAdapter.pointerMove(e.center.y);
      });

      manager.on("panmove", (e: any) => {
        pointerAdapter.pointerMove(e.center.y);
      });

      manager.on("panend", () => {
        pointerAdapter.pointerEnd();
      });

      manager.on("pancancel", () => {
        pointerAdapter.pointerEnd();
      });

      return () => {
        manager.stop();
        manager.destroy();
      };
    }
  }, [pointerAdapter, onTap, div]);
}
