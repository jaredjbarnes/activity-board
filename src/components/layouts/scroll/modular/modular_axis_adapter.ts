import { EasingFunction } from "motion-ux";
import { Factory } from "src/utils/factory.ts";
import { IModularCell } from "src/components/layouts/scroll/modular/i_modular_cell.ts";
import { SnapAxisAdapter } from "src/components/layouts/scroll/snap_axis_adapter.ts";
import { round } from "src/utils/round.ts";

export class ModularAxisAdapter extends SnapAxisAdapter {
  protected _modulus: number;
  protected _snapInterval: number;
  protected _modularCellFactory: Factory<IModularCell>;
  protected _scrollBuffer: number;

  constructor(
    modulus: number = 10,
    snapInterval = 100,
    scrollBuffer = 0,
    requestAnimationFrame?: (callback: () => void) => number,
    cancelAnimationFrame?: (id: number) => void
  ) {
    super(snapInterval, requestAnimationFrame, cancelAnimationFrame);
    this._scrollBuffer = scrollBuffer;
    this._modulus = modulus;
    this._snapInterval = snapInterval;

    this._modularCellFactory = new Factory(() => ({
      position: 0,
      size: 0,
      value: 0,
    }));
  }

  setSnapInterval(interval: number): void {
    this._snapInterval = interval;
  }

  setModulus(value: number) {
    this._modulus = value;
  }

  getModulus() {
    return this._modulus;
  }

  animateToValue(
    value: number,
    duration: number = 1000,
    easing?: EasingFunction,
    onComplete?: () => void
  ) {
    this.animateTo(
      this.getPositionForValue(value),
      duration,
      easing,
      onComplete
    );
  }

  scrollToValue(value: number) {
    this.scrollTo(this.getPositionForValue(value));
  }

  private getPositionForValue(value: number) {
    const modulus = this._modulus;
    const intervalRemainder = this.start % this._snapInterval;
    const position = this.start - intervalRemainder;
    const positionIndex = position / this._snapInterval;
    const currentIndex = positionIndex % this._modulus;

    let distance = value - currentIndex;
    const forwardMove = ((distance % modulus) + modulus) % modulus;
    const backwardMove = forwardMove - modulus;

    const moveByIndex =
      Math.abs(forwardMove) <= Math.abs(backwardMove)
        ? forwardMove
        : backwardMove;

    return (positionIndex + moveByIndex) * this._snapInterval;
  }

  getCurrentValue() {
    return this.getValueByPosition(this.start);
  }

  getVisibleCells() {
    const cells: IModularCell[] = [];
    this._modularCellFactory.releaseAll();

    const adjustedStart = this.start - this._scrollBuffer;
    const adjustedEnd = this.end + this._scrollBuffer;
    const start = round(adjustedStart / this._snapInterval) - 1;
    const end = round(adjustedEnd / this._snapInterval) + 1;

    for (let x = start; x < end; x++) {
      const cell = this._modularCellFactory.useInstance();

      let value = x % this._modulus;
      const position = x * this._snapInterval - this.start;

      if (value < 0) {
        value = this._modulus + value;
      }

      cell.position = position;
      cell.size = this._snapInterval;
      cell.value = value;

      cells.push(cell);
    }

    return cells;
  }

  getValueByPosition(position: number) {
    let value = round(position / this._snapInterval) % this._modulus;

    if (value < 0) {
      value = this._modulus + value;
    }
    return value;
  }
}
