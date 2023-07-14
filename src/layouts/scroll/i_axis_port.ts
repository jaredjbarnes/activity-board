import { ReadonlyObservableValue } from "@m/hex/observable_value";

export type ScrollHandler = ((domain: IAxisPort) => void) | null | undefined;

export interface IAxisPort {
  offsetBroadcast: ReadonlyObservableValue<number>;
  sizeBroadcast: ReadonlyObservableValue<number>;
  size: number;
  velocity: number;
  offset: number;
  start: number;
  end: number;
  isScrolling: boolean;
  onScrollStart: ScrollHandler;
  onScroll: ScrollHandler;
  onScrollEnd: ScrollHandler;
  initialize(value: number): void;
  pointerStart(value: number): void;
  pointerMove(value: number): void;
  pointerEnd(): void;
  reset(): void;
  stop(): void;
  setSize(value: number): void;
  disable(): void;
  enable(): void;
  scrollTo(value: number): void;
  animateOffsetTo(value: number, duration: number): void;
}
