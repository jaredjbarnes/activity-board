import {
  ObservableValue,
  ReadonlyObservableValue,
} from "@m/hex/observable_value";
import { FieldPort } from "src/controls/field_port.ts";
import { ModularAxisAdapter } from "src/layouts/scroll/modular/modular_axis_adapter.ts";
import { MonthAxisAdapter } from "src/layouts/scroll/month/month_axis_adapter.ts";

export class VDateScroller implements FieldPort<Date> {
  private _id: ObservableValue<string>;
  private _value: ObservableValue<Date>;
  private _label: ObservableValue<string>;
  private _monthAxis: ModularAxisAdapter;
  private _dayAxis: ModularAxisAdapter;
  // private _yearAxis: NumberAxisAdapter;

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
    requestAnimationFrame: (callback: () => void) => number,
    cancelAnimationFrame: (id: number) => void,
    id: string,
    label: string,
    value: Date
  ) {
    this._id = new ObservableValue(id);
    this._label = new ObservableValue(label);
    this._value = new ObservableValue(value);
    this._monthAxis = new ModularAxisAdapter(requestAnimationFrame, cancelAnimationFrame);
    this._dayAxis = new ModularAxisAdapter(requestAnimationFrame, cancelAnimationFrame);
  }

  setValue(value: Date): void {
    if (!isNaN(value.getTime())) {
      this._value.setValue(value);
    }
  }

  setError(error: Error): void {
    this._value.setError(error);
  }

  setLabel(label: string): void {
    this._label.setValue(label);
  }
}
