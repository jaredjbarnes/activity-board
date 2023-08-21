import { ObservableValue } from "@m/hex/observable_value";
import { PortalPresenter } from "src/components/utils/portal/portal_presenter.ts";

export type VerticalOrigin = "center" | "top" | "bottom";
export type HorizontalOrigin = "center" | "left" | "right";

export interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export class PopoverPresenter {
  private _portalPresenter: PortalPresenter = new PortalPresenter();
  private _anchorOffset = { x: 0, y: 0 };
  private _popoverPosition = new ObservableValue({ x: 0, y: 0 });
  private _anchorVerticalOrigin: VerticalOrigin = "bottom";
  private _anchorHorizontalOrigin: HorizontalOrigin = "left";
  private _popoverVerticalOrigin: VerticalOrigin = "top";
  private _popoverHorizontalOrigin: HorizontalOrigin = "left";
  private _popoverRect: Rect = { top: 0, right: 0, bottom: 0, left: 0 };
  private _anchorRect: Rect = { top: 0, right: 0, bottom: 0, left: 0 };
  private _boundingRect: Rect = {
    top: -Infinity,
    right: Infinity,
    bottom: Infinity,
    left: -Infinity,
  };
  private _isOpen = new ObservableValue(false);

  get isOpenBroadcast() {
    return this._isOpen.broadcast;
  }

  get popoverPositionBroadcast() {
    return this._popoverPosition.broadcast;
  }

  get portalPresenter() {
    return this._portalPresenter;
  }

  setAnchorRect(top: number, right: number, bottom: number, left: number) {
    this._anchorRect.top = top;
    this._anchorRect.right = right;
    this._anchorRect.bottom = bottom;
    this._anchorRect.left = left;
  }

  setBoundingRect(top: number, right: number, bottom: number, left: number) {
    this._boundingRect.top = top;
    this._boundingRect.right = right;
    this._boundingRect.bottom = bottom;
    this._boundingRect.left = left;
  }

  setAnchorOrigin(
    verticalOrigin: VerticalOrigin,
    horizontalOrigin: HorizontalOrigin
  ) {
    this._anchorVerticalOrigin = verticalOrigin;
    this._anchorHorizontalOrigin = horizontalOrigin;
  }

  setAnchorOffset(x: number, y: number) {
    this._anchorOffset.x = x;
    this._anchorOffset.y = y;
  }

  setPopoverRect(top: number, right: number, bottom: number, left: number) {
    this._popoverRect.top = top;
    this._popoverRect.right = right;
    this._popoverRect.bottom = bottom;
    this._popoverRect.left = left;
  }

  setPopoverOrigin(
    verticalOrigin: VerticalOrigin,
    horizontalOrigin: HorizontalOrigin
  ) {
    this._popoverVerticalOrigin = verticalOrigin;
    this._popoverHorizontalOrigin = horizontalOrigin;
  }

  updatePosition() {
    let x = 0;
    let y = 0;

    const boundingRect = this._boundingRect;
    const width = this._popoverRect.right - this._popoverRect.left;
    const height = this._popoverRect.bottom - this._popoverRect.top;

    if (this._anchorVerticalOrigin === "center") {
      y = Math.round(
        this._anchorRect.top +
          (this._anchorRect.bottom - this._anchorRect.top) / 2
      );
    } else {
      y = this._anchorRect[this._anchorVerticalOrigin];
    }

    if (this._anchorHorizontalOrigin === "center") {
      x = Math.round(
        this._anchorRect.left +
          (this._anchorRect.right - this._anchorRect.left) / 2
      );
    } else {
      x = this._anchorRect[this._anchorHorizontalOrigin];
    }

    if (this._popoverHorizontalOrigin === "center") {
      x = Math.round(x - width / 2);
    }

    if (this._popoverHorizontalOrigin === "right") {
      x = Math.round(x - width);
    }

    if (this._popoverVerticalOrigin === "center") {
      y = Math.round(y - height / 2);
    }

    if (this._popoverVerticalOrigin === "bottom") {
      y = Math.round(y - height);
    }

    if (y < boundingRect.top) {
      const difference = boundingRect.top - y;
      y += difference;
    }

    if (x + width > boundingRect.right) {
      const difference = x + width - boundingRect.right;
      x -= difference;
    }

    if (x < boundingRect.left) {
      const difference = boundingRect.left - x;
      x += difference;
    }

    if (y + height > boundingRect.bottom) {
      const difference = y + height - boundingRect.bottom;
      y -= difference;
    }

    this._popoverPosition.transformValue((position) => {
      position.x = x + this._anchorOffset.x;
      position.y = y + this._anchorOffset.y;
      return position;
    });
  }

  open() {
    this.portalPresenter.open();
    this._isOpen.setValue(true);
  }

  close() {
    this.portalPresenter.close();
    this._isOpen.setValue(false);
  }
}
