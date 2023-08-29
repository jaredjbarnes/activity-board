import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import React, { useCallback, useLayoutEffect, useRef } from "react";
import { PopoverPresenter } from "src/components/utils/popover/popover_presenter.ts";
import { PopoverVeil } from "src/components/utils/popover/popover_veil.tsx";
import { Portal } from "src/components/utils/portal/portal.tsx";

export interface PopoverProps {
  presenter: PopoverPresenter;
  children: React.ReactElement;
  anchorRef: React.RefObject<Element> | React.MutableRefObject<Element>;
}

export function Popover({ presenter, children, anchorRef }: PopoverProps) {
  const isOpen = useAsyncValue(presenter.isOpenBroadcast);
  const position = useAsyncValue(presenter.popoverPositionBroadcast);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const opacity = useAsyncValue(presenter.revealer.opacityBroadcast);
  const offset = useAsyncValue(presenter.revealer.offsetBroadcast);
  const isClosing = useAsyncValue(presenter.revealer.isClosingBroadcast);

  const updateRects = useCallback(() => {
    const popoverElement = popoverRef.current;
    const anchorElement = anchorRef.current;
    const windowXOffset = window.scrollX;
    const windowYOffset = window.scrollY;

    if (popoverElement != null) {
      const popoverRect = popoverElement.getBoundingClientRect();
      presenter.setPopoverRect(
        popoverRect.top + windowYOffset,
        popoverRect.right + windowXOffset,
        popoverRect.bottom + windowYOffset,
        popoverRect.left + windowXOffset
      );
    }

    if (anchorElement != null) {
      const anchorRect = anchorElement.getBoundingClientRect();
      presenter.setAnchorRect(
        anchorRect.top + windowYOffset,
        anchorRect.right + windowXOffset,
        anchorRect.bottom + windowYOffset,
        anchorRect.left + windowXOffset
      );
    }
    presenter.updatePosition();
  }, [presenter]);

  useLayoutEffect(() => {
    function updateBoundingRect() {
      const top = 0;
      const right = document.documentElement.clientWidth;
      const bottom = document.documentElement.clientHeight;
      const left = 0;

      presenter.setBoundingRect(top, right, bottom, left);
    }

    function onresize() {
      updateBoundingRect();
      updateRects();
    }

    updateBoundingRect();
    window.addEventListener("resize", onresize);

    return () => {
      window.removeEventListener("resize", onresize);
    };
  }, []);

  useLayoutEffect(() => {
    updateRects();
  }, [isOpen]);

  function close() {
    presenter.close();
  }

  return (
    <Portal presenter={presenter.portalPresenter}>
      <PopoverVeil
        style={{ opacity, pointerEvents: isClosing ? "none" : "auto" }}
        onClick={close}
      />
      <div
        ref={popoverRef}
        style={{
          display: "inline-block",
          position: "absolute",
          top: "0px",
          left: "0px",
          opacity,
          transform: `translate(${position.x}px, ${position.y + offset}px)`,
        }}
      >
        {children}
      </div>
    </Portal>
  );
}
