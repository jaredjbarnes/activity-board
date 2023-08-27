import { ObservableValue } from "@m/hex/observable_value";
import { DateFieldAdapter } from "src/components/controls/date/date_field_adapter.ts";
import { FieldPort } from "src/components/controls/field_port.ts";
import { TimeFieldAdapter } from "src/components/controls/time/time_field_adapter.ts";
import { PopoverPresenter } from "src/components/utils/popover/popover_presenter.ts";

export class DateTimeFieldAdapter implements FieldPort<Date> {
  private _id: ObservableValue<string>;
  private _value: ObservableValue<Date>;
  private _label: ObservableValue<string>;
  private _popoverPresenter: PopoverPresenter;
  private _dateFieldAdapter: DateFieldAdapter;
  private _timeFieldAdapter: TimeFieldAdapter;

  get dateFieldAdapter() {
    return this._dateFieldAdapter;
  }

  get timeFieldAdapter() {
    return this._timeFieldAdapter;
  }

  get popoverPresenter() {
    return this._popoverPresenter;
  }

  get idBroadcast() {
    return this._id.broadcast;
  }

  get valueBroadcast() {
    return this._value.broadcast;
  }

  get labelBroadcast() {
    return this._label.broadcast;
  }

  constructor(label: string, value: Date, id = "") {
    this._id = new ObservableValue(id);
    this._label = new ObservableValue(label);
    this._value = new ObservableValue(new Date(value));
    this._dateFieldAdapter = new DateFieldAdapter("", new Date(value));
    this._timeFieldAdapter = new TimeFieldAdapter(
      "",
      this._getTimeFromDate(value)
    );

    this._dateFieldAdapter.valueBroadcast.onChange((value) => {
      this._value.transformValue((date) => {
        date.setFullYear(value.getFullYear());
        date.setMonth(value.getMonth());
        date.setDate(value.getDate());

        return date;
      });
    });

    this._timeFieldAdapter.valueBroadcast.onChange((value) => {
      this._value.transformValue((date) => {
        date.setHours(0, 0, 0, 0);
        date.setMilliseconds(date.getMilliseconds() + value);

        return date;
      });
    });

    this._popoverPresenter = new PopoverPresenter();
    this._popoverPresenter.setAnchorOrigin("bottom", "center");
    this._popoverPresenter.setPopoverOrigin("top", "center");
  }

  setValue(value: Date): void {
    if (!isNaN(value.getTime())) {
      const time = this._getTimeFromDate(value);

      this._dateFieldAdapter.setValue(new Date(value));
      this._timeFieldAdapter.setValue(time);

      this._value.setValue(value);
    }
  }

  private _getTimeFromDate(date: Date) {
    const utilityDate = new Date(date);
    utilityDate.setHours(0, 0, 0, 0);

    return date.getTime() - utilityDate.getTime();
  }

  setError(error: Error): void {
    this._value.setError(error);
  }

  setLabel(label: string): void {
    this._label.setValue(label);
  }
}
