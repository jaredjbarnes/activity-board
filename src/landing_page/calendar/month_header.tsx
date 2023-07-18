import { useLayoutEffect, useState } from "react";
import "src/css/planner.css";
import { Month } from "src/landing_page/calendar/month.tsx";
import { MonthAxisAdapter } from "src/layouts/scroll/month_axis_adapter.ts";
import { VMonthScroll } from "src/layouts/scroll/v_month_scroll.tsx";

export interface MonthHeaderProps {
  date: Date;
  className?: string;
  style?: React.CSSProperties;
}

export function MonthHeader({ date, className, style }: MonthHeaderProps) {
  const month = date.getMonth();
  const year = date.getFullYear();

  const [monthAxisAdapter] = useState(() => {
    const monthAxisAdapter = new MonthAxisAdapter(
      requestAnimationFrame,
      cancelAnimationFrame,
      100
    );
    monthAxisAdapter.disable();
    monthAxisAdapter.scrollToDate(date);
    return monthAxisAdapter;
  });

  useLayoutEffect(() => {
    const date = new Date(year, month, 1);
    monthAxisAdapter.animateToDate(date);
  }, [month, year, monthAxisAdapter]);

  return (
    <VMonthScroll
      monthAxisAdapter={monthAxisAdapter}
      overflow="hidden"
      style={style}
      className={`${className} month-year-header`}
    >
      {(dateCell, _, index) => {
        return <Month key={index} dateCell={dateCell} />;
      }}
    </VMonthScroll>
  );
}
