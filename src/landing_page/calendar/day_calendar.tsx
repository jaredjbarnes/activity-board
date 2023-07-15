import "src/css/planner.css";
import { Day } from "src/landing_page/calendar/day.tsx";
import { DateAxisAdapter } from "src/layouts/scroll/date_axis_adapter.ts";
import { VDateScroll } from "src/layouts/scroll/v_date_scroll.tsx";

export interface DayCalendarProps {
  dateAxisAdapter: DateAxisAdapter;
  className?: string;
  style?: React.CSSProperties;
}

export function DayCalendar({
  dateAxisAdapter,
  className,
  style,
}: DayCalendarProps) {
  
  dateAxisAdapter.setSnapInterval(100);

  return (
    <VDateScroll
      dateAxisAdapter={dateAxisAdapter}
      style={style}
      className={`${className} calendar`}
    >
      {(dateCell) => {
        return <Day dateCell={dateCell} />;
      }}
    </VDateScroll>
  );
}
