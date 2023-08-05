import { EasingFunction } from "motion-ux";
import { Factory } from "src/factory.ts";
import { INumberCell } from "src/layouts/scroll/number/i_number_cell.ts";
import { SnapAxisAdapter } from "src/layouts/scroll/snap_axis_adapter.ts";
import { round } from "src/round.ts";

export class NumberAxisAdapter extends SnapAxisAdapter {
  protected _modulus: number;
  protected _snapInterval: number;
  protected _modularCellFactory: Factory<INumberCell>;
  protected _scrollBuffer: number;

  constructor(
    modulus: number = 10,
    snapInterval = 100,
    scrollBuffer = 0,
    requestAnimationFrame?: (callback: () => void) => number,
    cancelAnimationFrame?: (id: number) => void
  ) {
    super(snapInterval, requestAnimationFrame, cancelAnimationFrame);
    this._modulus = modulus;
    this._snapInterval = snapInterval;
    this._scrollBuffer = scrollBuffer;
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
    return value * this._snapInterval;
  }

  getCurrentValue() {
    return this.getValueByPosition(this.start);
  }

  getVisibleCells() {
    const cells: INumberCell[] = [];
    this._modularCellFactory.releaseAll();

    const adjustedStart = this.start - this._scrollBuffer;
    const adjustedEnd = this.end + this._scrollBuffer;

    const start = round(adjustedStart / this._snapInterval) - 1;
    const end = round(adjustedEnd / this._snapInterval) + 1;

    for (let x = start; x < end; x++) {
      const cell = this._modularCellFactory.useInstance();

      const value = x;
      const position = x * this._snapInterval - this.start;

      cell.position = position;
      cell.size = this._snapInterval;
      cell.value = value;

      cells.push(cell);
    }

    return cells;
  }

  getValueByPosition(value: number) {
    return round(value / this._snapInterval);
  }
}
