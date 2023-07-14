import { WeakPromise } from "@m/hex/weak_promise";

export interface ITimeRepositoryPort<T> {
  add(chore: T): WeakPromise<void>;
  remove(chore: T): WeakPromise<void>;
  update(chore: T): void;
  getAllWithinRange(startDate: Date, endDate: Date): WeakPromise<T[]>;
}