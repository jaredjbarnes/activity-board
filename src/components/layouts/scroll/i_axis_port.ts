import { ReadonlyObservableValue } from "@m/hex/observable_value";
import { IPointerPort } from "src/components/layouts/scroll/i_pointer_port.ts";

export type ScrollHandler = ((domain: IAxisPort) => void) | null | undefined;

export interface IAxisPort extends IPointerPort {
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
  reset(): void;
  stop(): void;
  setSize(value: number): void;
  disable(): void;
  enable(): void;
  scrollTo(value: number): void;
}
