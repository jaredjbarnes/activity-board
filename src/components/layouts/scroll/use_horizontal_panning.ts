import React, { useLayoutEffect } from "react";
import { IPointerPort } from "src/components/layouts/scroll/i_pointer_port.ts";
import "hammerjs";

declare var Hammer: any;

export function useHorizontalPanning(
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
        new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 5 })
      );

      manager.add(new Hammer.Tap());
      manager.add(new Hammer.Press({ time: 0 }));

      manager.on("tap", (e: any) => {
        onTap && onTap(e.srcEvent);
      });

      manager.on("panstart", (e: any) => {
        pointerAdapter.pointerStart(e.center.x);
      });

      manager.on("panmove", (e: any) => {
        pointerAdapter.pointerMove(e.center.x);
      });

      manager.on("panend", (e: any) => {
        pointerAdapter.pointerEnd(e.center.x);
      });

      manager.on("pancancel", (e: any) => {
        pointerAdapter.pointerEnd(e.center.x);
      });

      manager.on("press", (e: any) => {
        pointerAdapter.press(e.center.x);
      });

      manager.on("pressup", (e: any) => {
        pointerAdapter.pressUp(e.center.x);
      });

      return () => {
        manager.stop();
        manager.destroy();
      };
    }
  }, [pointerAdapter, onTap, div]);
}
