import "src/css/planner.css";
import { Day } from "src/app/landing_page/calendar/day.tsx";
import { DateAxisAdapter } from "src/components/layouts/scroll/date/date_axis_adapter.ts";
import { VDateScroll } from "src/components/layouts/scroll/date/v_date_scroll.tsx";

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
      {(dateCell, _, index) => {
        return <Day key={index} dateCell={dateCell} />;
      }}
    </VDateScroll>
  );
}
