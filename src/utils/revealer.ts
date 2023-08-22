import { ObservableValue } from "@m/hex/observable_value";
import { Motion, createAnimation, easings } from "motion-ux";

export class Revealer {
  private _motion: Motion<{ offset: number; opacity: number }>;
  private _offset: ObservableValue<number>;
  private _opacity: ObservableValue<number>;

  get opacityBroadcast() {
    return this._opacity.broadcast;
  }

  get offsetBroadcast() {
    return this._offset.broadcast;
  }

  constructor() {
    this._offset = new ObservableValue(15);
    this._opacity = new ObservableValue(0);

    this._motion = new Motion((animation) => {
      this._offset.setValue(animation.currentValues.offset);
      this._opacity.setValue(animation.currentValues.opacity);
    });

    this._motion.inject(createAnimation({ opacity: 0, offset: 15 }));
  }

  show(duration: number = 300) {
    return new Promise<void>((resolve) => {
      this._motion.segueTo(
        createAnimation({ opacity: 1, offset: 0 }),
        duration,
        easings.easeOutQuint,
        resolve
      );
    });
  }

  hide(duration: number = 300) {
    return new Promise<void>((resolve) => {
      this._motion.segueTo(
        createAnimation({ opacity: 0, offset: 15 }),
        duration,
        easings.easeOutQuint,
        resolve
      );
    });
  }
}
