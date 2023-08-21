import { ObservableValue } from "@m/hex/observable_value";
import { FieldPort } from "src/components/controls/field_port.ts";
import { ModularAxisAdapter } from "src/components/layouts/scroll/modular/modular_axis_adapter.ts";
import { NumberAxisAdapter } from "src/components/layouts/scroll/number/number_axis_adapter.ts";
import { PopoverPresenter } from "src/components/utils/popover/popover_presenter.ts";

export class DateFieldAdapter implements FieldPort<Date> {
  private _id: ObservableValue<string>;
  private _value: ObservableValue<Date>;
  private _label: ObservableValue<string>;
  private _dateSelectorPresenter: PopoverPresenter;
  private _monthAxis: ModularAxisAdapter;
  private _dateAxis: ModularAxisAdapter;
  private _yearAxis: NumberAxisAdapter;
  private _utilityDate: Date = new Date();

  get idBroadcast() {
    return this._id.broadcast;
  }

  get valueBroadcast() {
    return this._value.broadcast;
  }

  get labelBroadcast() {
    return this._label.broadcast;
  }

  get selectorPopoverPresenter() {
    return this._dateSelectorPresenter;
  }

  get monthAxis() {
    return this._monthAxis;
  }

  get dateAxis() {
    return this._dateAxis;
  }

  get yearAxis() {
    return this._yearAxis;
  }

  constructor(
    label: string,
    value: Date,
    id = "",
    requestAnimationFrame?: (callback: () => void) => number,
    cancelAnimationFrame?: (id: number) => void
  ) {
    this._id = new ObservableValue(id);
    this._label = new ObservableValue(label);
    this._value = new ObservableValue(new Date(value));
    this._dateSelectorPresenter = new PopoverPresenter();
    this._dateSelectorPresenter.setAnchorOrigin("bottom", "center");
    this._dateSelectorPresenter.setPopoverOrigin("top", "center");

    this._monthAxis = new ModularAxisAdapter(
      12,
      34,
      100,
      requestAnimationFrame,
      cancelAnimationFrame
    );

    this._dateAxis = new ModularAxisAdapter(
      31,
      34,
      100,
      requestAnimationFrame,
      cancelAnimationFrame
    );

    this._yearAxis = new NumberAxisAdapter(
      value.getFullYear(),
      34,
      100,
      requestAnimationFrame,
      cancelAnimationFrame
    );

    this._setMonth();
    this._setYear();
    this._setDate();

    this._monthAxis.onScroll = () => {
      this._transformIfDifferent(this._value.getValue());
    };

    this._dateAxis.onScroll = () => {
      this._transformIfDifferent(this._value.getValue());
    };

    this._yearAxis.onScroll = () => {
      this._transformIfDifferent(this._value.getValue());
    };
  }

  private _getAmountOfDaysInMonth(month: number, year: number) {
    this._utilityDate.setHours(0, 0, 0, 0);
    this._utilityDate.setDate(1);
    this._utilityDate.setMonth(month + 1);
    this._utilityDate.setFullYear(year);
    this._utilityDate.setDate(0);

    return this._utilityDate.getDate();
  }

  setValue(value: Date): void {
    if (!isNaN(value.getTime())) {
      this._transformValue(
        value.getDate(),
        value.getMonth(),
        value.getFullYear()
      );
      this._setMonth();
      this._setDate();
      this._setYear();
    }
  }

  // We reuse the date object because of GC while scrolling.
  private _transformValue(date: number, month: number, year: number) {
    this._value.transformValue((d) => {
      d.setHours(0, 0, 0, 0);
      d.setMonth(month);
      d.setDate(date);
      d.setFullYear(year);
      return d;
    });
  }

  private _transformIfDifferent(value: Date) {
    const isScrolling =
      Math.abs(this._monthAxis.velocity) > 0.5 ||
      Math.abs(this._yearAxis.velocity) > 0.5 ||
      Math.abs(this.dateAxis.velocity) > 0.5;

    if (isScrolling) {
      return;
    }

    const date = this._dateAxis.getCurrentValue();
    const month = this._monthAxis.getCurrentValue();
    const year = this._yearAxis.getCurrentValue();

    const daysOfMonth = this._getAmountOfDaysInMonth(month, year);
    if (date > daysOfMonth) {
      const day = Math.min(date, daysOfMonth);

      this.dateAxis.animateToValue(day);
      return;
    }

    const isDateDifferent = value.getDate() !== date + 1;
    const isMonthDifferent = value.getMonth() !== month;
    const isYearDifferent = value.getFullYear() !== year;

    if (isDateDifferent || isMonthDifferent || isYearDifferent) {
      this._transformValue(date + 1, month, year);
    }
  }

  private _setMonth() {
    const date = this._value.getValue();
    const month = date.getMonth();
    this._monthAxis.scrollToValue(month);
  }

  private _setDate() {
    const currentDate = this._value.getValue();
    const date = currentDate.getDate();
    this._dateAxis.scrollToValue(date - 1);
  }

  private _setYear() {
    const date = this._value.getValue();
    const year = date.getFullYear();
    this._yearAxis.scrollToValue(year);
  }

  setError(error: Error): void {
    this._value.setError(error);
  }

  setLabel(label: string): void {
    this._label.setValue(label);
  }

  showDateSelector() {
    this._dateSelectorPresenter.open();
  }

  hideDateSelector() {
    this._dateSelectorPresenter.close();
  }
}
