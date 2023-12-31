import { EasingFunction } from "motion-ux";
import { Factory } from "src/utils/factory.ts";
import { IDateCell } from "src/components/layouts/scroll/date/i_date_cell.ts";
import { SnapAxisAdapter } from "src/components/layouts/scroll/snap_axis_adapter.ts";
import { round } from "src/utils/round.ts";

const ONE_DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

export class DateAxisAdapter extends SnapAxisAdapter {
  protected _snapInterval: number;
  protected _anchorDate: Date;
  protected _dateCellFactory: Factory<IDateCell>;
  protected _scrollBuffer: number;

  constructor(
    snapInterval = 100,
    scrollBuffer = 0,
    requestAnimationFrame?: (callback: () => void) => number,
    cancelAnimationFrame?: (id: number) => void
  ) {
    super(snapInterval, requestAnimationFrame, cancelAnimationFrame);
    this._snapInterval = snapInterval;
    this._scrollBuffer = scrollBuffer;
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

  animateToDate(
    date: Date,
    duration: number = 1000,
    easing?: EasingFunction,
    onComplete?: () => void
  ) {
    this.animateTo(this.getPositionForDate(date), duration, easing, onComplete);
  }

  scrollToDate(date: Date) {
    this.scrollTo(this.getPositionForDate(date));
  }

  private getPositionForDate(date: Date) {
    const index = this.getDaysBetweenDates(this._anchorDate, date);
    return index * this._snapInterval;
  }

  getCurrentDate() {
    return this.getDateByPosition(-this.offset);
  }

  getVisibleCells() {
    const cells: IDateCell[] = [];
    this._dateCellFactory.releaseAll();
    const currentDate = this.getDateByPosition(this.start - this._scrollBuffer);
    const endDate = this.getDateByPosition(this.end + this._scrollBuffer);

    currentDate.setDate(currentDate.getDate() - 1);
    endDate.setDate(endDate.getDate() + 1);

    while (currentDate.getTime() < endDate.getTime()) {
      const cell = this._dateCellFactory.useInstance();
      const position = this.getPositionForDate(currentDate) - this.start;

      cell.position = position;
      cell.size = this._snapInterval;
      cell.date = new Date(currentDate);

      cells.push(cell);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return cells;
  }

  getDateByPosition(value: number) {
    const index = round(value / this._snapInterval);
    const date = new Date(this._anchorDate);

    date.setDate(date.getDate() + index);
    return date;
  }

  private getDaysBetweenDates(from: Date, to: Date) {
    const timeBetween = to.getTime() - from.getTime();
    const daysBetweenDates = timeBetween / ONE_DAY_IN_MILLISECONDS;

    return round(daysBetweenDates);
  }
}
