export interface IPointerPort {
  pointerStart(value: number): void;
  pointerMove(value: number): void;
  pointerEnd(): void;
}
