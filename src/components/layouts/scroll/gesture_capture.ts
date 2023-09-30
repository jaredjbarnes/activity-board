export class GestureCaptureManager {
  private _hammerManagers: Map<HammerManager, (event: HammerInput) => void>;

  constructor() {
    this._hammerManagers = new Map();
  }

  makeExclusive(hammerManager: HammerManager, event: HammerInput) {
    const entries = Array.from(this._hammerManagers.entries());

    entries.forEach((e) => {
      if (hammerManager !== e[0]) {
        e[1](event);
      }
    });
  }

  register(
    hammerManager: HammerManager,
    stopCallback: (event: HammerInput) => void
  ) {
    this._hammerManagers.set(hammerManager, stopCallback);
  }

  unregister(hammerManager: HammerManager) {
    this._hammerManagers.delete(hammerManager);
  }
}

export class GestureCapture {
  static manager = new GestureCaptureManager();
}
