import { ObservableValue } from "@m/hex/observable_value";
import { PortalPresenter } from "src/components/utils/portal/portal_presenter.ts";
import { Revealer } from "src/utils/revealer.ts";

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
  private _preferredAnchorVerticalOrigin: VerticalOrigin = "bottom";
  private _preferredAnchorHorizontalOrigin: HorizontalOrigin = "left";
  private _preferredPopoverVerticalOrigin: VerticalOrigin = "top";
  private _preferredPopoverHorizontalOrigin: HorizontalOrigin = "left";
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
  private _revealer = new Revealer();

  get isOpenBroadcast() {
    return this._isOpen.broadcast;
  }

  get popoverPositionBroadcast() {
    return this._popoverPosition.broadcast;
  }

  get portalPresenter() {
    return this._portalPresenter;
  }

  get revealer() {
    return this._revealer;
  }

  get anchorVerticalOrigin() {
    return this._anchorVerticalOrigin;
  }

  get anchorHorizontalOrigin() {
    return this._anchorHorizontalOrigin;
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

  private _finalizeOrigins() {
    const top = Math.max(this._boundingRect.top, this._popoverRect.top);
    const bottom = Math.min(
      this._boundingRect.bottom,
      this._popoverRect.bottom
    );
    const left = Math.max(this._boundingRect.left, this._popoverRect.left);
    const right = Math.min(this._boundingRect.right, this._popoverRect.right);

    const width = right - left;
    const popoverWidth = this._popoverRect.right - this._popoverRect.left;
    const height = bottom - top;
    const popoverHeight = this._popoverRect.bottom - this._popoverRect.top;

    const widthDoesNotFit = popoverWidth !== width;
    const heightDoesNotFit = popoverHeight !== height;

    if (this._preferredPopoverHorizontalOrigin === "left" && widthDoesNotFit) {
      this._popoverHorizontalOrigin = "right";

      if (this._preferredAnchorHorizontalOrigin === "right") {
        this._anchorHorizontalOrigin = "left";
      }
    }

    if (this._preferredPopoverHorizontalOrigin === "right" && widthDoesNotFit) {
      this._popoverHorizontalOrigin = "left";

      if (this._preferredAnchorHorizontalOrigin === "left") {
        this._anchorHorizontalOrigin = "right";
      }
    }

    if (this._preferredPopoverVerticalOrigin === "top" && heightDoesNotFit) {
      this._popoverVerticalOrigin = "bottom";

      if (this._preferredAnchorVerticalOrigin === "bottom") {
        this._anchorVerticalOrigin = "top";
      }
    }

    if (this._preferredPopoverVerticalOrigin === "bottom" && heightDoesNotFit) {
      this._popoverVerticalOrigin = "top";

      if (this._preferredAnchorVerticalOrigin === "top") {
        this._anchorVerticalOrigin = "bottom";
      }
    }
  }

  setAnchorOrigin(
    verticalOrigin: VerticalOrigin,
    horizontalOrigin: HorizontalOrigin
  ) {
    this._preferredAnchorVerticalOrigin = verticalOrigin;
    this._preferredAnchorHorizontalOrigin = horizontalOrigin;
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
    this._preferredPopoverVerticalOrigin = verticalOrigin;
    this._preferredPopoverHorizontalOrigin = horizontalOrigin;
    this._popoverVerticalOrigin = verticalOrigin;
    this._popoverHorizontalOrigin = horizontalOrigin;
  }

  updatePosition() {
    this._setOriginsToPreferred();

    const initialX = this._getXPosition();
    const initialY = this._getYPosition();

    this._updatePopoverRect(initialX, initialY);
    this._finalizeOrigins();

    const finalX = this._getXPosition();
    const finalY = this._getYPosition();

    this._popoverPosition.transformValue((position) => {
      position.x = finalX + this._anchorOffset.x;
      position.y = finalY + this._anchorOffset.y;
      return position;
    });
  }

  private _updatePopoverRect(x: number, y: number) {
    const xDifference = x - this._popoverRect.left;
    const yDifference = y - this._popoverRect.top;

    this._popoverRect.left += xDifference;
    this._popoverRect.right += xDifference;
    this._popoverRect.top += yDifference;
    this._popoverRect.bottom += yDifference;
  }

  private _setOriginsToPreferred() {
    this._popoverHorizontalOrigin = this._preferredPopoverHorizontalOrigin;
    this._popoverVerticalOrigin = this._preferredPopoverVerticalOrigin;
    this._anchorHorizontalOrigin = this._preferredAnchorHorizontalOrigin;
    this._anchorVerticalOrigin = this._preferredAnchorVerticalOrigin;
  }

  private _getXPosition() {
    let x = 0;

    const width = this._popoverRect.right - this._popoverRect.left;

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

    return x;
  }

  private _getYPosition() {
    let y = 0;

    const height = this._popoverRect.bottom - this._popoverRect.top;

    if (this._anchorVerticalOrigin === "center") {
      y = Math.round(
        this._anchorRect.top +
          (this._anchorRect.bottom - this._anchorRect.top) / 2
      );
    } else {
      y = this._anchorRect[this._anchorVerticalOrigin];
    }

    if (this._popoverVerticalOrigin === "center") {
      y = Math.round(y - height / 2);
    }

    if (this._popoverVerticalOrigin === "bottom") {
      y = Math.round(y - height);
    }

    return y;
  }

  open() {
    this.portalPresenter.open();
    this._isOpen.setValue(true);
    this._revealer.show();
  }

  close() {
    this._revealer.hide().then(() => {
      this.portalPresenter.close();
      this._isOpen.setValue(false);
    });
  }
}
