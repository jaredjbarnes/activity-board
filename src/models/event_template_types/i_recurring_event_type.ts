export interface IRecurringEventType {
  startTime: number; // In milliseconds, 0 to 86400000 (24 * 60 * 60 * 1000)
  duration: number; // In milliseconds
  startOn: number; // In milliseconds from Unix Epoch
  endOn: number | null; // In milliseconds from Unix Epoch, nullable
}