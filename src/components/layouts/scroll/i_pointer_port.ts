export interface IPointerPort {
  press(value: number):void;
  pressUp(value: number):void;
  pointerStart(value: number): void;
  pointerMove(value: number): void;
  pointerEnd(value: number): void;
}
