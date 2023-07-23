import { ReadonlyObservableValue } from "@m/hex/observable_value";

export interface FieldPort<T> {
  id: ReadonlyObservableValue<string>;
  value: ReadonlyObservableValue<T>;
  label: ReadonlyObservableValue<string>;

  setValue(value: T): void;
  setError(error: Error): void;
  setLabel(label: string): void;
}
