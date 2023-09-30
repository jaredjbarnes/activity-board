import { ObservableValue } from "@m/hex/observable_value";

export interface Viewport {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export class ViewportCapturePresenter {
  private _viewport: ObservableValue<Viewport>;

  get viewportBroadcast() {
    return this._viewport.broadcast;
  }

  constructor() {
    this._viewport = new ObservableValue<Viewport>({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });
  }

  setViewport(top: number, right: number, bottom: number, left: number) {
    this._viewport.transformValue((v) => {
      v.top = top;
      v.right = right;
      v.bottom = bottom;
      v.left = left;
      return v;
    });
  }

}
