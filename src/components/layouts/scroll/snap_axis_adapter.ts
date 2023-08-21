import { round } from "src/utils/round.ts";
import { AxisAdapter } from "src/components/layouts/scroll/axis_adapter.ts";

export class SnapAxisAdapter extends AxisAdapter {
  protected _snapInterval: number | null = null;

  constructor(
    snapInterval?: number,
    requestAnimationFrame?: (callback: () => void) => number,
    cancelAnimationFrame?: (id: number) => void
  ) {
    super(requestAnimationFrame, cancelAnimationFrame);
    if (snapInterval != null) {
      this._snapInterval = Math.max(snapInterval, 0);
    }
  }

  setSnapInterval(interval?: number) {
    this._snapInterval = interval || null;
  }

  pointerEnd() {
    super.pointerEnd();

    if (!this._isEnabled) {
      return;
    }

    this.settle();
  }

  stop() {
    const canSettle = this.isScrolling && this._isEnabled;
    super.stop();

    if (canSettle) {
      this.settle();
    }
  }

  protected settle() {
    const offset = this._offset.getValue();
    const delta = this._deltaOffset;
    const distance = this.deriveDistance(delta);
    const value = this.round(offset + distance);

    if (value <= this.maxOffset && value >= this.minOffset) {
      const snapInterval = this._snapInterval == null ? 0 : this._snapInterval;
      const difference = Math.abs(value - offset);
      const duration = difference < snapInterval ? 300 : 2000;
      this.animateOffsetTo(value, duration);
    }
  }

  protected deriveDistance(delta: number) {
    const interval = this._snapInterval || this.size;
    const step = Math.round(delta / (1 - 0.97) / interval);
    return step * interval;
  }

  protected round(value: number) {
    const unit = this._snapInterval == null ? this.size : this._snapInterval;
    return round(value, unit);
  }
}
