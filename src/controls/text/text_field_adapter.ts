import { ObservableValue } from "@m/hex/observable_value";
import { FieldPort } from "src/controls/field_port.ts";

export class TextFieldAdapter implements FieldPort<string> {
  private _id: ObservableValue<string, any>;
  private _value: ObservableValue<string, any>;
  private _label: ObservableValue<string, any>;

  get id() {
    return this._id.broadcast;
  }

  get label() {
    return this._label.broadcast;
  }

  get value() {
    return this._value.broadcast;
  }

  constructor(label: string, value: string, id = "") {
    this._label = new ObservableValue(label);
    this._value = new ObservableValue(value);
    this._id = new ObservableValue(id);
  }

  setValue(value: string): void {
    this._value.setValue(value);
  }

  setError(error: Error): void {
    this._value.setError(error);
  }

  setLabel(label: string): void {
    this._label.setValue(label);
  }
}
