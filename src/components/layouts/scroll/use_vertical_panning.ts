import React, { useLayoutEffect } from "react";
import { IPointerPort } from "src/components/layouts/scroll/i_pointer_port.ts";
import "hammerjs";
import { GestureCapture } from "src/components/layouts/scroll/gesture_capture.ts";

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

      manager.add(new Hammer.Press({ time: 0 }));
      manager.add(new Hammer.Tap());

      manager.on("tap", (e: any) => {
        onTap && onTap(e.srcEvent);
      });

      manager.on("panstart", (e: any) => {
        pointerAdapter.pointerStart(e.center.y);
        GestureCapture.manager.makeExclusive(manager, e);
      });

      manager.on("panmove", (e: any) => {
        pointerAdapter.pointerMove(e.center.y);
      });

      manager.on("panend", (e: any) => {
        pointerAdapter.pointerEnd(e.center.y);
      });

      manager.on("pancancel", (e: any) => {
        pointerAdapter.pointerEnd(e.center.y);
      });

      manager.on("press", (e: any) => {
        pointerAdapter.press(e.center.y);
      });

      manager.on("pressup", (e: any) => {
        pointerAdapter.pressUp(e.center.y);
      });

      GestureCapture.manager.register(manager, (event)=>{
        manager.emit("pancancel", event);
      });

      return () => {
        manager.stop();
        manager.destroy();
        GestureCapture.manager.unregister(manager);
      };
    }
  }, [pointerAdapter, onTap, div]);
}
