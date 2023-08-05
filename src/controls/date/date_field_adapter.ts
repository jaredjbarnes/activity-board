import { ObservableValue } from "@m/hex/observable_value";
import { DateFieldDynamicStyles } from "src/controls/date/date_field_dynamic_styles.ts";
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
  private _dynamicStyles: DateFieldDynamicStyles;

  get idBroadcast() {
    return this._id.broadcast;
  }

  get valueBroadcast() {
    return this._value.broadcast;
  }

  get labelBroadcast() {
    return this._label.broadcast;
  }

  get isExpandedBroadcast() {
    return this._isExpanded.broadcast;
  }

  get dynamicStyles() {
    return this._dynamicStyles;
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
    this._isExpanded = new ObservableValue(false);
    this._dynamicStyles = new DateFieldDynamicStyles();

    this._monthAxis = new ModularAxisAdapter(
      12,
      34,
      100,
      requestAnimationFrame,
      cancelAnimationFrame
    );

    this._dateAxis = new ModularAxisAdapter(
      this._getAmountOfDaysInMonth(value.getDate(), value.getFullYear()),
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
      this._updateDaysIfNecessary();
    };

    this._dateAxis.onScroll = () => {
      this._transformIfDifferent(this._value.getValue());
    };

    this._yearAxis.onScroll = () => {
      this._transformIfDifferent(this._value.getValue());
      this._updateDaysIfNecessary();
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

  private _updateDaysIfNecessary() {
    const date = this._value.getValue();
    const modulus = this._dateAxis.getModulus();
    const dateModulus = this._getAmountOfDaysInMonth(
      date.getMonth(),
      date.getFullYear()
    );

    if (dateModulus !== modulus) {
      console.log(dateModulus, modulus);
      this._dateAxis.setModulus(dateModulus);
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
      d.setMonth(month);
      d.setDate(date);
      d.setFullYear(year);
      return d;
    });
  }

  private _transformIfDifferent(value: Date) {
    const date = this._dateAxis.getCurrentValue();
    const month = this._monthAxis.getCurrentValue();
    const year = this._yearAxis.getCurrentValue();

    const isDateDifferent = value.getDate() !== date + 1;
    const isMonthDifferent = value.getMonth() !== month;
    const isYearDifferent = value.getFullYear() !== year;

    if (isDateDifferent || isMonthDifferent || isYearDifferent) {
      console.log("Changed", date, month, year);
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

  expand() {
    this._isExpanded.setValue(true);
    this._dynamicStyles.expand();
  }

  contract() {
    this._isExpanded.setValue(false);
    this._dynamicStyles.contract();
  }
}
