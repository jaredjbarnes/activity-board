import { EasingFunction } from "motion-ux";
import { Factory } from "src/factory.ts";
import { SnapAxisAdapter } from "src/layouts/scroll/snap_axis_adapter.ts";
import { round } from "src/round.ts";

export interface DateCell {
  position: number;
  size: number;
  date: Date;
}

export class MonthAxisAdapter extends SnapAxisAdapter {
  protected _snapInterval: number;
  protected _anchorDate: Date;
  protected _dateCellFactory: Factory<DateCell>;

  constructor(
    snapInterval = 100,
    requestAnimationFrame?: (callback: () => void) => number,
    cancelAnimationFrame?: (id: number) => void
  ) {
    super(snapInterval, requestAnimationFrame, cancelAnimationFrame);
    this._snapInterval = snapInterval;

    this._anchorDate = new Date();
    this._anchorDate.setDate(1);
    this._anchorDate.setHours(0, 0, 0, 0);

    this._dateCellFactory = new Factory(() => ({
      position: 0,
      size: 0,
      date: new Date(),
    }));
  }

  setSnapInterval(interval: number): void {
    this._snapInterval = interval;
  }

  animateToDate(
    date: Date,
    duration: number = 1000,
    easing?: EasingFunction,
    onComplete?: () => void
  ) {
    const position = this.getPositionForDate(date);
    this.animateTo(position, duration, easing, onComplete);
  }

  scrollToDate(date: Date) {
    const position = this.getPositionForDate(date);
    this.scrollTo(position);
  }

  private getPositionForDate(date: Date) {
    const months = this.getMonthsBetweenDates(this._anchorDate, date);
    return months * this._snapInterval;
  }

  getCurrentMonth() {
    return this.getDateByPosition(-this.offset);
  }

  getVisibleCells() {
    const cells: DateCell[] = [];
    this._dateCellFactory.releaseAll();
    const currentDate = this.getDateByPosition(this.start);
    const endDate = this.getDateByPosition(this.end);

    currentDate.setMonth(currentDate.getMonth() - 1);
    endDate.setMonth(endDate.getMonth() + 1);

    while (currentDate.getTime() < endDate.getTime()) {
      const cell = this._dateCellFactory.useInstance();
      const position = this.getPositionForDate(currentDate) - this.start;

      cell.position = position;
      cell.size = this._snapInterval;
      cell.date = new Date(currentDate);

      cells.push(cell);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return cells;
  }

  getDateByPosition(value: number) {
    const monthsAway = round(value / this._snapInterval);
    const date = new Date(this._anchorDate);
    date.setMonth(date.getMonth() + monthsAway);
    return date;
  }

  private getMonthsBetweenDates(from: Date, to: Date) {
    let months;

    months = (to.getFullYear() - from.getFullYear()) * 12;
    months -= from.getMonth();
    months += to.getMonth();

    return months;
  }
}
