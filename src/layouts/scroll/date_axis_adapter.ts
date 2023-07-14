import { Factory } from "src/factory.ts";
import { SnapAxisAdapter } from "src/layouts/scroll/snap_axis_adapter.ts";
import { round } from "src/round.ts";

const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

export interface DateCell {
  position: number;
  size: number;
  date: Date;
}

export class DateAxisAdapter extends SnapAxisAdapter {
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
    const days = this.daysBetweenTwoDates(this._anchorDate, date);
    const offset = days * this._snapInterval;

    this.animateTo(offset);
  }

  scrollToDate(date: Date) {
    const days = this.daysBetweenTwoDates(this._anchorDate, date);
    const offset = days * this._snapInterval;

    this.scrollTo(offset);
  }

  getVisibleCells() {
    const cells: DateCell[] = [];
    this._dateCellFactory.releaseAll();
    const currentDate = this.getDateByPosition(this.start);
    const endDate = this.getDateByPosition(this.end);

    while (currentDate.getTime() < endDate.getTime()) {
      const cell = this._dateCellFactory.useInstance();
      const index = this.daysBetweenTwoDates(this._anchorDate, currentDate);
      const position = index * this._snapInterval;

      cell.position = position;
      cell.size = this._snapInterval;
      cell.date = new Date(currentDate);

      cells.push(cell);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return cells;
  }

  private getDateByPosition(value: number) {
    const index = round(value / this._snapInterval);
    const date = new Date(this._anchorDate);

    date.setDate(date.getDate() + index);
    return date;
  }

  private daysBetweenTwoDates(from: Date, to: Date) {
    const timeBetween = to.getTime() - from.getTime();
    const daysBetweenDates = timeBetween / ONE_DAY_IN_MILLISECONDS;

    return round(daysBetweenDates);
  }
}