import { Factory } from "src/factory.ts";
import { SnapAxisAdapter } from "src/layouts/scroll/snap_axis_adapter.ts";

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
    requestAnimationFrame: (callback: () => void) => number,
    cancelAnimationFrame: (id: number) => void,
    snapInterval = 100
  ) {
    super(requestAnimationFrame, cancelAnimationFrame, snapInterval);
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

  animateToDate(date: Date) {
    this.animateTo(this.getPositionForDate(date));
  }

  scrollToDate(date: Date) {
    this.scrollTo(this.getPositionForDate(date));
  }

  private getPositionForDate(date: Date) {
    const months = this.getMonthsBetweenDates(this._anchorDate, date);
    return months * this._snapInterval - this.start;
  }

  getVisibleCells() {
    const cells: DateCell[] = [];
    this._dateCellFactory.releaseAll();
    const currentDate = this.getDateByPosition(this.start);
    const endDate = this.getDateByPosition(this.end);

    currentDate.setDate(currentDate.getMonth() - 1);
    endDate.setDate(endDate.getMonth() + 1);

    while (currentDate.getTime() < endDate.getTime()) {
      const cell = this._dateCellFactory.useInstance();
      const position = this.getPositionForDate(currentDate);

      cell.position = position;
      cell.size = this._snapInterval;
      cell.date = new Date(currentDate);

      cells.push(cell);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return cells;
  }

  getDateByPosition(value: number) {
    const monthsAway = Math.floor(value / this._snapInterval);
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
