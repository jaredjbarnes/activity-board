import { useLayoutEffect, useState } from "react";
import "src/css/planner.css";
import { Month } from "src/landing_page/calendar/month.tsx";
import { MonthAxisAdapter } from "src/layouts/scroll/month/month_axis_adapter.ts";
import { VMonthScroll } from "src/layouts/scroll/month/v_month_scroll.tsx";

export interface MonthHeaderProps {
  monthAxisAdapter: MonthAxisAdapter;
  className?: string;
  style?: React.CSSProperties;
}

export function MonthHeader({ monthAxisAdapter, className, style }: MonthHeaderProps) {

  useLayoutEffect(() => {
    monthAxisAdapter.setSnapInterval(100);
  }, [monthAxisAdapter]);

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
