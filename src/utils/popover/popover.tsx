import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import React, { useCallback, useLayoutEffect, useRef } from "react";
import { ClickAwayListener } from "src/utils/click_away_listener/click_away_listener.tsx";
import { PopoverPresenter } from "src/utils/popover/popover_presenter.ts";
import { Portal } from "src/utils/portal/portal.tsx";

export interface PopoverProps {
  presenter: PopoverPresenter;
  children: React.ReactElement;
  anchorRef: React.MutableRefObject<Element>;
}

export function Popover({ presenter, children, anchorRef }: PopoverProps) {
  const isOpen = useAsyncValue(presenter.isOpenBroadcast);
  const position = useAsyncValue(presenter.popoverPositionBroadcast);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const updateRects = useCallback(() => {
    const popoverElement = popoverRef.current;
    const anchorElement = anchorRef.current;

    if (popoverElement != null) {
      const popoverRect = popoverElement.getBoundingClientRect();
      presenter.setPopoverRect(
        popoverRect.top,
        popoverRect.right,
        popoverRect.bottom,
        popoverRect.left
      );
    }

    if (anchorElement != null) {
      const anchorRect = anchorElement.getBoundingClientRect();
      presenter.setPopoverRect(
        anchorRect.top,
        anchorRect.right,
        anchorRect.bottom,
        anchorRect.left
      );
    }
  }, [presenter]);

  useLayoutEffect(() => {
    updateRects();
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen) {
      function onresize() {
        updateRects();
      }
      window.addEventListener("resize", onresize);

      return () => {
        window.removeEventListener("resize", onresize);
      };
    }
  }, [isOpen]);

  function close() {
    presenter.close();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Portal presenter={presenter.portalPresenter}>
      <ClickAwayListener onClickAway={close}>
        <div
          ref={popoverRef}
          style={{
            display: "inline-block",
            position: "absolute",
            top: "0px",
            left: "0px",
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          {children}
        </div>
      </ClickAwayListener>
    </Portal>
  );
}
