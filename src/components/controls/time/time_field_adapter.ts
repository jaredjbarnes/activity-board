import { ObservableValue } from "@m/hex/observable_value";
import { FieldPort } from "src/components/controls/field_port.ts";
import { ModularAxisAdapter } from "src/components/layouts/scroll/modular/modular_axis_adapter.ts";
import { NumberAxisAdapter } from "src/components/layouts/scroll/number/number_axis_adapter.ts";
import { PopoverPresenter } from "src/components/utils/popover/popover_presenter.ts";

const HOUR_IN_MILLISECONDS = 1000 * 60 * 60;
const MINUTES_IN_MILLISECONDS = 1000 * 60;

export class TimeFieldAdapter implements FieldPort<number> {
  private _id: ObservableValue<string>;
  private _value: ObservableValue<number>;
  private _label: ObservableValue<string>;
  private _popoverPresenter: PopoverPresenter;
  private _hourAxis: ModularAxisAdapter;
  private _minuteAxis: ModularAxisAdapter;
  private _meridiemAxis: NumberAxisAdapter;

  get idBroadcast() {
    return this._id.broadcast;
  }

  get valueBroadcast() {
    return this._value.broadcast;
  }

  get labelBroadcast() {
    return this._label.broadcast;
  }

  get popoverPresenter() {
    return this._popoverPresenter;
  }

  get hourAxis() {
    return this._hourAxis;
  }

  get minuteAxis() {
    return this._minuteAxis;
  }

  get meridiemAxis() {
    return this._meridiemAxis;
  }

  constructor(
    label: string,
    value: number,
    id = "",
    requestAnimationFrame?: (callback: () => void) => number,
    cancelAnimationFrame?: (id: number) => void
  ) {
    this._id = new ObservableValue(id);
    this._label = new ObservableValue(label);
    this._value = new ObservableValue(value);
    this._popoverPresenter = new PopoverPresenter();
    this._popoverPresenter.setAnchorOrigin("bottom", "center");
    this._popoverPresenter.setPopoverOrigin("top", "center");

    this._hourAxis = new ModularAxisAdapter(
      12,
      34,
      100,
      requestAnimationFrame,
      cancelAnimationFrame
    );

    this._minuteAxis = new ModularAxisAdapter(
      60,
      34,
      100,
      requestAnimationFrame,
      cancelAnimationFrame
    );

    this._meridiemAxis = new NumberAxisAdapter(
      34,
      100,
      requestAnimationFrame,
      cancelAnimationFrame
    );
    this._meridiemAxis._stiffness = 4;
    this._meridiemAxis.minValue = 0;
    this._meridiemAxis.maxValue = 1;

    this._syncHours(this.getHours());
    this._syncMinutes(this.getMinutes());
    this._syncMeridiem(this.getMeridiem());

    const updateValue = () => {
      this._transformIfDifferent();
    };

    this.hourAxis.onScroll = updateValue;
    this._minuteAxis.onScroll = updateValue;
    this._meridiemAxis.onScroll = updateValue;

    this._hourAxis.onScrollEnd = updateValue;
    this._minuteAxis.onScrollEnd = updateValue;
    this._meridiemAxis.onScrollEnd = updateValue;
  }

  setValue(value: number): void {
    if (!isNaN(value)) {
      this._value.setValue(value);

      const hours = this.getHours();
      const meridiem = this.getMeridiem();
      const minutes = this.getMinutes();

      this._syncHours(hours);
      this._syncMinutes(minutes);
      this._syncMeridiem(meridiem);
    }
  }

  getHours() {
    const value = this._value.getValue();
    return Math.floor(value / HOUR_IN_MILLISECONDS) % 12;
  }

  getMinutes() {
    const value = this._value.getValue();
    return Math.floor((value % HOUR_IN_MILLISECONDS) / MINUTES_IN_MILLISECONDS);
  }

  getMeridiem() {
    const value = this._value.getValue();
    const hours = Math.floor(value / HOUR_IN_MILLISECONDS);
    return hours >= 12 ? 1 : 0;
  }

  getHoursLabel() {
    const value = this._value.getValue();
    const labelValue = Math.floor(value / HOUR_IN_MILLISECONDS) % 12;
    return labelValue === 0 ? "12" : labelValue.toString().padStart(2, "0");
  }

  getMinutesLabel() {
    const value = this._value.getValue();
    const labelValue = Math.floor(
      (value % HOUR_IN_MILLISECONDS) / MINUTES_IN_MILLISECONDS
    );

    return labelValue.toString().padStart(2, "0");
  }

  getMeridiemLabel() {
    const value = this.getMeridiem();
    return value > 0 ? "PM" : "AM";
  }

  private _transformToMilliseconds(
    hours: number,
    minutes: number,
    meridiem: number
  ) {
    const hoursInMilliseconds = hours * HOUR_IN_MILLISECONDS;
    const minutesInMilliseconds = minutes * MINUTES_IN_MILLISECONDS;
    let meridiemInMilliseconds = 0;

    if (meridiem > 0) {
      meridiemInMilliseconds = 12 * HOUR_IN_MILLISECONDS;
    }

    return hoursInMilliseconds + minutesInMilliseconds + meridiemInMilliseconds;
  }

  private _transformIfDifferent() {
    const value = this._value.getValue();
    const isScrolling =
      Math.abs(this._hourAxis.velocity) > 0.5 ||
      Math.abs(this._minuteAxis.velocity) > 0.5 ||
      Math.abs(this._meridiemAxis.velocity) > 0.5;

    if (isScrolling) {
      return;
    }

    const hours = this._hourAxis.getCurrentValue();
    const minutes = this._minuteAxis.getCurrentValue();
    const meridiem = Math.floor(
      Math.max(0, Math.min(1, this._meridiemAxis.getCurrentValue()))
    );

    const valueInScroll = this._transformToMilliseconds(
      hours,
      minutes,
      meridiem
    );

    if (valueInScroll !== value) {
      this._value.setValue(valueInScroll);
    }
  }

  private _syncHours(hours: number) {
    this._hourAxis.scrollToValue(hours);
  }

  private _syncMinutes(minutes: number) {
    this._minuteAxis.scrollToValue(minutes);
  }

  private _syncMeridiem(meridiem: number) {
    this._meridiemAxis.scrollToValue(meridiem);
  }

  setError(error: Error): void {
    this._value.setError(error);
  }

  setLabel(label: string): void {
    this._label.setValue(label);
  }
}
