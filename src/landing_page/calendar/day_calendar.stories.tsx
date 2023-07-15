import { useState } from "react";
import { DayCalendar } from "src/landing_page/calendar/day_calendar.tsx";
import { DateAxisAdapter } from "src/layouts/scroll/date_axis_adapter.ts";

export default {
  title: "landing_page/day_calendar",
  component: DayCalendar,
};

export function Example() {
  const [dateAxisAdapter] = useState(() => {
    return new DateAxisAdapter(requestAnimationFrame, cancelAnimationFrame);
  });

  return <DayCalendar dateAxisAdapter={dateAxisAdapter} style={{
    width: "80px",
    height: "100%"
  }} />
}
