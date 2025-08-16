import { IMonthlyChore } from "src/event_generator/models/i_chore.ts";
import { IChoreRecord } from "src/event_generator/models/i_chore_record.ts";
import { ITimeRepositoryPort } from "src/services/i_time_repository_port.ts";

export class MonthlyChoreService {
  private monthlyChoreRepository: ITimeRepositoryPort<IMonthlyChore>;
  private monthlyChoreRecordRepository: ITimeRepositoryPort<IChoreRecord>;

  constructor(
    monthlyChoreRepository: ITimeRepositoryPort<IMonthlyChore>,
    monthlyChoreRecordRepository: ITimeRepositoryPort<IChoreRecord>
  ) {
    this.monthlyChoreRepository = monthlyChoreRepository;
    this.monthlyChoreRecordRepository = monthlyChoreRecordRepository;
  }

  addChore(chore: IMonthlyChore) {}

  getAllEvents(start: Date, end: Date) {}

  getAllCompletedChores(start: Date, end: Date) {}

  completeChore(chore: IMonthlyChore) {}
}
