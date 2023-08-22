import { useAsyncValue } from "@m/hex/hooks/use_async_value";
import React, { useCallback, useLayoutEffect, useRef } from "react";
import { ClickAwayListener } from "src/components/utils/click_away_listener/click_away_listener.tsx";
import { PopoverPresenter } from "src/components/utils/popover/popover_presenter.ts";
import { PopoverVeil } from "src/components/utils/popover/popover_veil.tsx";
import { Portal } from "src/components/utils/portal/portal.tsx";

export interface PopoverProps {
  presenter: PopoverPresenter;
  children: React.ReactElement;
  anchorRef: React.RefObject<Element> | React.MutableRefObject<Element>;
  hasVeil?: boolean;
}

export function Popover({
  presenter,
  children,
  anchorRef,
  hasVeil = false,
}: PopoverProps) {
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
      presenter.setAnchorRect(
        anchorRect.top,
        anchorRect.right,
        anchorRect.bottom,
        anchorRect.left
      );
    }
    presenter.updatePosition();
  }, [presenter]);

  useLayoutEffect(() => {
    updateRects();
  }, [isOpen]);

  useLayoutEffect(() => {
    if (isOpen) {
      function onresize() {
        const top = 0;
        const right = document.documentElement.clientWidth;
        const bottom = document.documentElement.clientHeight;
        const left = 0;

        presenter.setBoundingRect(top, right, bottom, left);
        updateRects();
      }

      onresize();
      window.addEventListener("resize", onresize);

      return () => {
        window.removeEventListener("resize", onresize);
      };
    }
  }, [isOpen]);

  function handleClickAway() {
    presenter.close();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <Portal presenter={presenter.portalPresenter}>
      {hasVeil && <PopoverVeil />}
      <ClickAwayListener onClickAway={handleClickAway}>
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
