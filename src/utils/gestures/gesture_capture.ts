export interface CaptureControls {
  start(): void;
  exclusivelyStart(): void;
  end(): void;
  cancel(): void;
}

export interface PanCapture {
  initialize(captureControls: CaptureControls): RecognizerOptions;
  start(event: HammerInput): void;
  move(event: HammerInput): void;
  end(event: HammerInput): void;
  cancel(event: HammerInput): void;
  up(event: HammerInput): void;
  right(event: HammerInput): void;
  down(event: HammerInput): void;
  left(event: HammerInput): void;
}

export interface PinchCapture {
  initialize(captureControls: CaptureControls): RecognizerOptions;
  start(event: HammerInput): void;
  move(event: HammerInput): void;
  end(event: HammerInput): void;
  cancel(event: HammerInput): void;
  in(event: HammerInput): void;
  out(event: HammerInput): void;
}

export interface PressCapture {
  initialize(captureControls: CaptureControls): RecognizerOptions;
  press(event: HammerInput): void;
  pressUp(event: HammerInput): void;
}

export interface RotateCapture {
  initialize(captureControls: CaptureControls): RecognizerOptions;
  start(event: HammerInput): void;
  move(event: HammerInput): void;
  end(event: HammerInput): void;
  cancel(event: HammerInput): void;
}

export interface SwipeCapture {
  initialize(captureControls: CaptureControls): RecognizerOptions;
  up(event: HammerInput): void;
  right(event: HammerInput): void;
  down(event: HammerInput): void;
  left(event: HammerInput): void;
}

export interface TapCapture {
  initialize(captureControls: CaptureControls): RecognizerOptions;
  tap(event: HammerInput): void;
}
