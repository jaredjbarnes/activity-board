import { ObservableValue } from "@m/hex/observable_value";
import { Motion, createAnimation, easings } from "motion-ux";

interface InputStyle {
  inputHeight: number;
  scrollerPosition: number;
}

export class DateFieldDynamicStyles {
  private _motion: Motion<InputStyle>;
  private _inputHeight: ObservableValue<number>;
  private _scrollerPosition: ObservableValue<number>;

  get inputHeightBroadcast() {
    return this._inputHeight.broadcast;
  }

  get scrollerPosition() {
    return this._scrollerPosition.broadcast;
  }

  constructor() {
    this._inputHeight = new ObservableValue(40);
    this._scrollerPosition = new ObservableValue(0);

    this._motion = new Motion((animation) => {
      this._inputHeight.setValue(animation.currentValues.inputHeight);
      this._scrollerPosition.setValue(animation.currentValues.scrollerPosition);
    });
  }

  initialize() {
    this._motion.segueTo(
      createAnimation({
        inputHeight: 40,
        scrollerPosition: 0,
      }),
      32
    );
  }

  expand() {
    this._motion.segueTo(
      createAnimation({
        inputHeight: 120,
        scrollerPosition: 40,
      }),
      1000,
      easings.easeOutQuint
    );
  }

  contract() {
    this._motion.segueTo(
      createAnimation({
        inputHeight: 120,
        scrollerPosition: 40,
      }),
      1000,
      easings.easeOutQuint
    );
  }
}
