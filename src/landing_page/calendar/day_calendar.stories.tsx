import { useLayoutEffect, useState } from "react";
import { DayCalendar } from "src/landing_page/calendar/day_calendar.tsx";
import { MonthHeader } from "src/landing_page/calendar/month_header.tsx";
import { DateAxisAdapter } from "src/layouts/scroll/date_axis_adapter.ts";
import { MonthAxisAdapter } from "src/layouts/scroll/month_axis_adapter.ts";

export default {
  title: "Landing Page/Day Calendar",
  component: DayCalendar,
};

export function SidebarCalendar() {
  const [dateAxisAdapter] = useState(() => {
    return new DateAxisAdapter(requestAnimationFrame, cancelAnimationFrame);
  });

  return (
    <DayCalendar
      dateAxisAdapter={dateAxisAdapter}
      style={{
        width: "80px",
        height: "100%",
      }}
    />
  );
}

export function MonthHeaderExample() {
  const [monthAxisAdapter] = useState(() => {
    const monthAxisAdapter = new MonthAxisAdapter(
      requestAnimationFrame,
      cancelAnimationFrame
    );

    monthAxisAdapter.scrollToDate(new Date(2023, 0, 1));

    return monthAxisAdapter;
  });

  function next() {
    const currentDate = monthAxisAdapter.getCurrentMonth();
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);

    monthAxisAdapter.animateToDate(newDate);
  }

  function prev() {
    const currentDate = monthAxisAdapter.getCurrentMonth();
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);

    monthAxisAdapter.animateToDate(newDate);
  }

  return (
    <div>
      <MonthHeader
        monthAxisAdapter={monthAxisAdapter}
        style={{
          width: "300px",
          height: "100px",
        }}
      />
      <button onClick={prev}>Prev</button>
      <button onClick={next}>Next</button>
    </div>
  );
}

export function BasicCalendar() {
  const [monthAxisAdapter] = useState(() => {
    const monthAxisAdapter = new MonthAxisAdapter(
      requestAnimationFrame,
      cancelAnimationFrame
    );

    return monthAxisAdapter;
  });

  const [dateAxisAdapter] = useState(() => {
    const dateAxisAdapter = new DateAxisAdapter(
      requestAnimationFrame,
      cancelAnimationFrame
    );

    return dateAxisAdapter;
  });

  useLayoutEffect(() => {
    let currentMonthDate = monthAxisAdapter.getCurrentMonth();

    function nullableScroll() {}

    function onDateScrollStart() {
      monthAxisAdapter.disable();
      dateAxisAdapter.onScroll = onDateScroll;
      monthAxisAdapter.onScrollStart = nullableScroll;
      monthAxisAdapter.onScrollEnd = nullableScroll;
    }

    function onDateScrollEnd() {
      monthAxisAdapter.enable();
      dateAxisAdapter.onScroll = nullableScroll;
      monthAxisAdapter.onScrollStart = onMonthScrollStart;
      monthAxisAdapter.onScrollEnd = onMonthScrollEnd;
    }

    function onMonthScrollStart() {
      dateAxisAdapter.disable();
      monthAxisAdapter.onScroll = onMonthScroll;
      dateAxisAdapter.onScrollStart = nullableScroll;
      dateAxisAdapter.onScrollEnd = nullableScroll;
    }

    function onMonthScrollEnd() {
      dateAxisAdapter.enable();
      monthAxisAdapter.onScroll = nullableScroll;
      dateAxisAdapter.onScrollStart = onDateScrollStart;
      dateAxisAdapter.onScrollEnd = onDateScrollEnd;
    }

    dateAxisAdapter.onScrollStart = onDateScrollStart;
    dateAxisAdapter.onScrollEnd = onDateScrollEnd;

    monthAxisAdapter.onScrollStart = onMonthScrollStart;
    monthAxisAdapter.onScrollEnd = onMonthScrollEnd;

    function onDateScroll() {
      const currentDate = dateAxisAdapter.getCurrentDate();

      if (
        currentDate.getMonth() !== currentMonthDate.getMonth() ||
        currentDate.getFullYear() !== currentMonthDate.getFullYear()
      ) {
        const newDate = new Date(currentDate);
        newDate.setDate(1);
        newDate.setHours(0, 0, 0, 0);

        currentMonthDate = newDate;

        monthAxisAdapter.animateToDate(newDate);
      }
    }

    function onMonthScroll() {
      const currentDate = monthAxisAdapter.getCurrentMonth();

      if (
        currentDate.getMonth() !== currentMonthDate.getMonth() ||
        currentDate.getFullYear() !== currentMonthDate.getFullYear()
      ) {
        const newDate = new Date(currentDate);
        newDate.setDate(1);
        newDate.setHours(0, 0, 0, 0);

        currentMonthDate = newDate;

        dateAxisAdapter.animateToDate(newDate);
      }
    }

    monthAxisAdapter.onScroll = nullableScroll;
    dateAxisAdapter.onScroll = nullableScroll;
  }, [dateAxisAdapter, monthAxisAdapter]);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100px",
          borderBottom: "3px solid black",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "5px",
          left: "83px",
          width: "0px",
          height: "90px",
          borderLeft: "3px solid black",
        }}
      ></div>

      <div
        style={{
          position: "absolute",
          top: "105px",
          left: "83px",
          width: "0px",
          bottom: "5px",
          borderLeft: "3px solid black",
        }}
      ></div>
      <DayCalendar
        dateAxisAdapter={dateAxisAdapter}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "80px",
          height: "100%",
        }}
      />
      <MonthHeader
        monthAxisAdapter={monthAxisAdapter}
        style={{
          position: "absolute",
          top: 0,
          left: "100px",
          width: "300px",
          height: "100px",
        }}
      />
    </>
  );
}
