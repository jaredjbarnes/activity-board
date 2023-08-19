import { ReadonlyObservableValue } from "@m/hex/observable_value";

export interface FieldPort<T> {
  idBroadcast: ReadonlyObservableValue<string>;
  valueBroadcast: ReadonlyObservableValue<T>;
  labelBroadcast: ReadonlyObservableValue<string>;

  setValue(value: T): void;
  setError(error: Error): void;
  setLabel(label: string): void;
}
