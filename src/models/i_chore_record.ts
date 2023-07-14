export interface IChoreRecord {
  choreId: string;
  completedOn: number; // unix epoch
  quality: number; // 0-1
}
