import React, { useEffect, useCallback, useRef } from "react";
import { useForkRef } from "src/components/utils/hooks/use_fork_ref.ts";
export interface ClickAwayListenerProps {
  children: React.ReactElement;
  onClickAway: (event: React.MouseEvent | React.TouchEvent) => void;
  mouseEvent?: "onMouseUp" | "onMouseDown" | "onClick";
  touchEvent?: "onTouchStart" | "onTouchEnd";
  // An array of refs that wont trigger the click away listener
  refs?: React.RefObject<Element>[];
}
const eventMap = {
  onClick: "click",
  onMouseDown: "mousedown",
  onMouseUp: "mouseup",
};
const touchMap = {
  onTouchStart: "touchstart",
  onTouchEnd: "touchend",
};
export const ClickAwayListener = React.forwardRef<
  HTMLElement,
  ClickAwayListenerProps
>(function ClickAwayListener(
  { children, mouseEvent, touchEvent, onClickAway, refs = [] },
  ref
) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const DOMMouseEvent = eventMap[mouseEvent || "onClick"];
  const DOMTouchEvent = touchMap[touchEvent || "onTouchEnd"];
  const forkedRef = useForkRef(ref, nodeRef, (children as any).ref);
  const activatedRef = React.useRef(false);
  const startedOnElement = React.useRef(false);

  React.useEffect(() => {
    // Ensure that this component is not "activated" synchronously.
    // https://github.com/facebook/react/issues/20074
    window.setTimeout(() => {
      activatedRef.current = true;
    }, 0);
    return () => {
      activatedRef.current = false;
    };
  }, []);

  const eventHandler = useCallback(
    (event: any) => {
      if (!activatedRef.current) {
        startedOnElement.current = false;
        return;
      }

      let eventTreeContainsExceptions: boolean;

      if (event.composedPath) {
        eventTreeContainsExceptions =
          [nodeRef, ...refs].find((ref) => {
            return event.composedPath().indexOf(ref.current) > -1;
          }) !== undefined;
      } else {
        eventTreeContainsExceptions =
          !document.documentElement.contains(event.target) ||
          [nodeRef, ...refs].find((ref) => {
            return ref.current?.contains(event.target);
          }) !== undefined;
      }
      
      if (!eventTreeContainsExceptions && !startedOnElement.current) {
        onClickAway(event);
      }

      startedOnElement.current = false;
    },
    [onClickAway, nodeRef, refs]
  );

  useEffect(() => {
    const element = nodeRef.current;
    if (element != null) {
      function mousedown() {
        startedOnElement.current = true;
      }

      element.addEventListener("mousedown", mousedown);

      return () => {
        element.removeEventListener("mousedown", mousedown);
      };
    }
  }, []);

  useEffect(() => {
    document.addEventListener(DOMMouseEvent, eventHandler);
    document.addEventListener(DOMTouchEvent, eventHandler);

    return () => {
      document.removeEventListener(DOMMouseEvent, eventHandler);
      document.removeEventListener(DOMTouchEvent, eventHandler);
    };
  }, [DOMTouchEvent, DOMMouseEvent, eventHandler]);

  return React.cloneElement(children, {
    ...children.props,
    ref: forkedRef,
  });
});
