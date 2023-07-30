import { ObservableValue } from "@m/hex/observable_value";
import { FieldPort } from "src/controls/field_port.ts";
import { ModularAxisAdapter } from "src/layouts/scroll/modular/modular_axis_adapter.ts";
import { NumberAxisAdapter } from "src/layouts/scroll/number/number_axis_adapter.ts";

export class DateFieldAdapter implements FieldPort<Date> {
  private _id: ObservableValue<string>;
  private _value: ObservableValue<Date>;
  private _label: ObservableValue<string>;
  private _monthAxis: ModularAxisAdapter;
  private _dateAxis: ModularAxisAdapter;
  private _yearAxis: NumberAxisAdapter;
  private _utilityDate: Date = new Date();
  private _isExpanded: ObservableValue<boolean>;

  get id() {
    return this._id.broadcast;
  }

  get value() {
    return this._value.broadcast;
  }

  get label() {
    return this._label.broadcast;
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
    this._value = new ObservableValue(value);
    this._isExpanded = new ObservableValue(false);

    this._monthAxis = new ModularAxisAdapter(
      12,
      40,
      requestAnimationFrame,
      cancelAnimationFrame
    );

    this._dateAxis = new ModularAxisAdapter(
      this._getAmountOfDaysInMonth(value.getDate(), value.getFullYear()),
      40,
      requestAnimationFrame,
      cancelAnimationFrame
    );

    this._yearAxis = new NumberAxisAdapter(
      value.getFullYear(),
      40,
      requestAnimationFrame,
      cancelAnimationFrame
    );

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
    this._utilityDate.setMonth(month + 1);
    this._utilityDate.setFullYear(year);
    this._utilityDate.setDate(-1);

    return this._utilityDate.getDate();
  }

  private _updateDaysIfNecessary() {
    const date = this._value.getValue();
    const modulus = this._dateAxis.getModulus();
    const dateModulus = this._getAmountOfDaysInMonth(
      date.getMonth(),
      date.getFullYear()
    );

    if (dateModulus !== modulus) {
      this._dateAxis.setModulus(modulus);
    }
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
      d.setMonth(date);
      d.setDate(month);
      d.setFullYear(year);
      return d;
    });
  }

  private _transformIfDifferent(value: Date) {
    const date = this._dateAxis.getCurrentValue();
    const month = this._dateAxis.getCurrentValue();
    const year = this._dateAxis.getCurrentValue();

    const isDateDifferent = value.getDate() !== date + 1;
    const isMonthDifferent = value.getMonth() !== month;
    const isYearDifferent = value.getFullYear() !== year;

    if (isDateDifferent || isMonthDifferent || isYearDifferent) {
      this._transformValue(date, month, year);
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
    this._dateAxis.scrollToValue(date);
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

  expand() {
    this._isExpanded.setValue(true);
  }

  contract() {
    this._isExpanded.setValue(false);
  }
}
