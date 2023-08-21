export interface IPointerPort {
  touchStart():void;
  pointerStart(value: number): void;
  pointerMove(value: number): void;
  pointerEnd(): void;
  touchEnd(): void;
}
