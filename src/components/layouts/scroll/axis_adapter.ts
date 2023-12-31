import {
  ObservableValue,
  ReadonlyObservableValue,
} from "@m/hex/observable_value";
import {
  createAnimation,
  EasingFunction,
  easings,
  createDynamicEasing,
  Motion,
} from "motion-ux";
import { IAxisPort, ScrollHandler } from "./i_axis_port.ts";

const customBoundsEasing = createDynamicEasing("quad", "quint");

export class AxisAdapter implements IAxisPort {
  private _requestAnimationFrame;
  private _cancelAnimationFrame;
  protected _offset = new ObservableValue<number>(0);
  protected _size = new ObservableValue<number>(0);
  protected _motion: Motion<{ offset: number }>;
  protected _isPointerDown = false;
  protected _isScrolling = false;
  protected _isEnabled = true;
  protected _requestAnimationId = -1;
  protected _lastPointerEventTime = Date.now();
  protected _lastOffset: number = 0;
  protected _startOffset: number = 0;
  protected _deltaOffset: number = 0;
  protected _deltaOffsetHistory = new Array<number>(3);
  protected _minOffset: number = -Infinity;
  protected _maxOffset: number = Infinity;

  _stiffness: number = 1;

  get offsetBroadcast(): ReadonlyObservableValue<number> {
    return this._offset;
  }

  get sizeBroadcast(): ReadonlyObservableValue<number> {
    return this._size;
  }

  get offset() {
    return this._offset.getValue();
  }

  set offset(value: number) {
    this.processScrollEnd();
    this.onScrollStart && this.onScrollStart(this);
    this._offset.setValue(value);
    this.onScroll && this.onScroll(this);
    this.onScrollEnd && this.onScrollEnd(this);
  }

  get start() {
    return -this._offset.getValue();
  }

  get end() {
    return this.start + this.size;
  }

  get size() {
    return this._size.getValue();
  }

  get velocity() {
    return this._deltaOffset;
  }

  get isScrolling() {
    return this._isScrolling;
  }

  get min() {
    return -this._maxOffset;
  }

  set min(value: number) {
    this._maxOffset = -value;
  }

  get max() {
    return -this._minOffset;
  }

  set max(value: number) {
    this._minOffset = -value;
  }

  get minOffset() {
    return this._minOffset;
  }

  set minOffset(value: number) {
    this._minOffset = value;
  }

  get maxOffset() {
    return this._maxOffset;
  }

  set maxOffset(value: number) {
    this._maxOffset = value;
  }

  onScrollStart: ScrollHandler;
  onScroll: ScrollHandler;
  onScrollEnd: ScrollHandler;

  constructor(
    requestAnimationFrame: (
      callback: () => void
    ) => number = window.requestAnimationFrame,
    cancelAnimationFrame: (id: number) => void = window.cancelAnimationFrame
  ) {
    this._motion = new Motion(
      ({ currentValues }) => {
        this._offset.transformValue((o) =>
          this.updateFromAnimation(o, currentValues.offset)
        );
        this.processScroll();
      },
      { offset: 0 }
    );

    this._requestAnimationFrame = requestAnimationFrame;
    this._cancelAnimationFrame = cancelAnimationFrame;
    this._deltaOffsetHistory.fill(0);
  }

  private updateFromAnimation(offset: number, newOffset: number) {
    this._deltaOffset = newOffset - offset;
    this._deltaOffsetHistory.fill(this._deltaOffset);
    this._lastOffset = offset;
    return newOffset;
  }

  private processScrollStart() {
    if (!this._isScrolling) {
      this._isScrolling = true;
      this.onScrollStart && this.onScrollStart(this);
    }
  }

  private processScroll() {
    if (this.isScrolling) {
      this.onScroll && this.onScroll(this);
    }
  }

  private processScrollEnd() {
    if (this._isScrolling) {
      this.reset();
      this._isScrolling = false;
      this.onScrollEnd && this.onScrollEnd(this);
    }
  }

  initialize(value: number) {
    this._motion.segueTo(createAnimation({ offset: value }));
  }

  reset() {
    this.cancelMomentum();
    this._motion.stop();
    this._lastPointerEventTime = Date.now();
    this._lastOffset = this._offset.getValue();
    this._deltaOffset = 0;
    this._deltaOffsetHistory.fill(0);
  }

  press(value: number): void {
    this.pointerStart(value);
  }

  pressUp(_: number) {
    this.pointerEnd();
  }

  pointerStart(value: number) {
    if (!this._isEnabled) {
      return;
    }

    this.reset();
    this._isPointerDown = true;
    this._lastOffset = value;
    this._startOffset = value;
    this.processScrollStart();
  }

  pointerMove(value: number) {
    const now = Date.now();
    const deltaTime = now - this._lastPointerEventTime;
    const frames = Math.floor(deltaTime / 16);
    const delta = (value - this._lastOffset) / frames;
    const noActivePointer = !this._isPointerDown;
    const disabled = !this._isEnabled;
    const tooFast = deltaTime < 16;

    if (noActivePointer || disabled || tooFast) {
      return;
    }

    this._lastPointerEventTime = now;
    this._lastOffset = value;

    this.updatePointerDelta(delta);

    this._offset.transformValue((o) => {
      return o + this._deltaOffset;
    });

    this.processScroll();
  }

  pointerEnd() {
    if (!this._isPointerDown) {
      return;
    }

    this._isPointerDown = false;

    if (!this._isEnabled) {
      return;
    }

    const now = Date.now();
    if (now - this._lastPointerEventTime > 32) {
      this._deltaOffset = 0;
    }

    this._lastPointerEventTime = now;

    const offset = this._offset.getValue();
    const delta = Math.abs(this._deltaOffset);

    if (delta > 3) {
      this._requestAnimationId = requestAnimationFrame(() => {
        this.finishMomentum();
      });
    } else {
      if (offset < this._minOffset) {
        this.animateOffsetTo(this._minOffset, 700, customBoundsEasing, () => {
          this.processScrollEnd();
        });
      } else if (offset > this.maxOffset) {
        this.animateOffsetTo(this._maxOffset, 700, customBoundsEasing, () => {
          this.processScrollEnd();
        });
      } else {
        this.processScrollEnd();
      }
    }
  }

  private updatePointerDelta(delta: number) {
    let total = 0;

    for (let i = 0; i < 3; i++) {
      if (i < 2) {
        this._deltaOffsetHistory[i] = this._deltaOffsetHistory[i + 1];
      } else {
        this._deltaOffsetHistory[i] = delta;
      }

      total += this._deltaOffsetHistory[i];
    }

    const averageX = total / 3;
    this._deltaOffset = averageX;
  }

  private finishMomentum() {
    this.updateDelta();
    const isSpringingBackIntoBounds = this.springIntoBounds();
    this.fillDeltaHistory();

    const offset = this._offset.getValue();
    const requestAnimationFrame = this._requestAnimationFrame;
    const sufficientSpeedToContinue = Math.abs(this._deltaOffset) > 0.1;
    const beyondBounds = offset < this.minOffset || offset > this.maxOffset;

    if (
      !isSpringingBackIntoBounds &&
      (sufficientSpeedToContinue || beyondBounds)
    ) {
      this._offset.transformValue((o) => {
        o = o + this._deltaOffset;
        return o;
      });

      this.onScroll && this.onScroll(this);

      this._requestAnimationId = requestAnimationFrame(() => {
        this.finishMomentum();
      });
    } else if (!sufficientSpeedToContinue && !beyondBounds) {
      this.processScrollEnd();
    }
  }

  private cancelMomentum() {
    const cancelAnimationFrame = this._cancelAnimationFrame;
    cancelAnimationFrame(this._requestAnimationId);
    this._requestAnimationId = -1;
  }

  private updateDelta() {
    this._deltaOffset = this._deltaOffset * 0.97;
  }

  private springIntoBounds() {
    const offset = this._offset.getValue();
    const delta = this._deltaOffset;

    if (offset > this._maxOffset) {
      if (delta >= 0.9) {
        this._deltaOffset *=
          1 - (offset - this._maxOffset) / (200 / this._stiffness);
      } else {
        this.reset();
        this.animateOffsetTo(this._maxOffset, 700, customBoundsEasing, () => {
          this.processScrollEnd();
        });
        return true;
      }
    } else if (offset < this.minOffset) {
      if (delta <= -0.9) {
        this._deltaOffset *=
          1 - (this.minOffset - offset) / (200 / this._stiffness);
      } else {
        this.reset();
        this.animateOffsetTo(this._minOffset, 700, customBoundsEasing, () => {
          this.processScrollEnd();
        });
        return true;
      }
    }

    return false;
  }

  private fillDeltaHistory() {
    this._deltaOffsetHistory.fill(this._deltaOffset);
  }

  animateTo(
    value: number,
    duration = 2000,
    easing: EasingFunction = easings.easeOutQuint,
    onComplete?: () => void
  ) {
    this.animateOffsetTo(-value, duration, easing, onComplete);
  }

  protected animateOffsetTo(
    value: number,
    duration = 2000,
    easing: EasingFunction = easings.easeOutQuint,
    onComplete?: () => void
  ) {
    this.processScrollStart();

    const offset = this._offset.getValue();
    const delta = this._deltaOffset;
    const animation = createAnimation({
      offset: {
        from: offset - delta,
        to: offset,
      },
    });

    value = this.getValueWithinBounds(value);
    this.reset();
    this._motion.inject(animation);
    this._motion.segueTo(
      createAnimation({ offset: value }),
      duration,
      easing,
      () => {
        this.processScrollEnd();
        onComplete && onComplete();
      }
    );
  }

  protected getValueWithinBounds(value: number) {
    return Math.min(this._maxOffset, Math.max(value, this._minOffset));
  }

  stop() {
    this.processScrollEnd();
  }

  setSize(value: number) {
    if (this.size == value) {
      return;
    }

    this._size.setValue(value);
  }

  disable() {
    this._isEnabled = false;
  }

  enable() {
    this._isEnabled = true;
  }

  scrollTo(value: number) {
    this.offset = -value;
  }
}
