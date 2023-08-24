import { useLayoutEffect, useState } from "react";
import { DayCalendar } from "src/app/landing_page/calendar/day_calendar.tsx";
import { MonthHeader } from "src/app/landing_page/calendar/month_header.tsx";
import { DateAxisAdapter } from "src/components/layouts/scroll/date/date_axis_adapter.ts";
import { MonthAxisAdapter } from "src/components/layouts/scroll/month/month_axis_adapter.ts";

export default {
  title: "Landing Page/Day Calendar",
  component: DayCalendar,
};

window.devicePixelRatio = 2;

export function SidebarCalendar() {
  const [dateAxisAdapter] = useState(() => {
    return new DateAxisAdapter();
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

function getAmountOfDaysInMonth(month: number, year: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(1);
  date.setMonth(month + 1);
  date.setFullYear(year);
  date.setDate(0);

  return date.getDate();
}

export function MonthHeaderExample() {
  const [monthAxisAdapter] = useState(() => {
    const monthAxisAdapter = new MonthAxisAdapter();

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
    const monthAxisAdapter = new MonthAxisAdapter();

    return monthAxisAdapter;
  });

  const [dateAxisAdapter] = useState(() => {
    const dateAxisAdapter = new DateAxisAdapter();

    return dateAxisAdapter;
  });

  useLayoutEffect(() => {
    let currentMonthDate = monthAxisAdapter.getCurrentMonth();

    function nullableScroll() {}

    function onDateScrollStart() {
      monthAxisAdapter.disable();
      monthAxisAdapter.onScroll = nullableScroll;
      monthAxisAdapter.onScrollStart = nullableScroll;
      monthAxisAdapter.onScrollEnd = nullableScroll;

      dateAxisAdapter.onScroll = onDateScroll;
    }

    function onDateScrollEnd() {
      if (monthAxisAdapter.isScrolling) {
        monthAxisAdapter.onScrollEnd = () => {
          monthAxisAdapter.enable();
          monthAxisAdapter.onScrollStart = onMonthScrollStart;
          monthAxisAdapter.onScrollEnd = onMonthScrollEnd;
        };
      } else {
        monthAxisAdapter.enable();
        monthAxisAdapter.onScrollStart = onMonthScrollStart;
        monthAxisAdapter.onScrollEnd = onMonthScrollEnd;
      }

      dateAxisAdapter.onScroll = nullableScroll;
    }

    function onMonthScrollStart() {
      dateAxisAdapter.disable();
      dateAxisAdapter.onScroll = nullableScroll;
      dateAxisAdapter.onScrollStart = nullableScroll;
      dateAxisAdapter.onScrollEnd = nullableScroll;

      monthAxisAdapter.onScroll = onMonthScroll;
    }

    function onMonthScrollEnd() {
      if (dateAxisAdapter.isScrolling) {
        dateAxisAdapter.onScrollEnd = () => {
          dateAxisAdapter.enable();
          dateAxisAdapter.onScrollStart = onDateScrollStart;
          dateAxisAdapter.onScrollEnd = onDateScrollEnd;
        };
      } else {
        dateAxisAdapter.enable();
        dateAxisAdapter.onScrollStart = onDateScrollStart;
        dateAxisAdapter.onScrollEnd = onDateScrollEnd;
      }

      monthAxisAdapter.onScroll = nullableScroll;
    }

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
        const date = Math.min(
          dateAxisAdapter.getCurrentDate().getDate(),
          getAmountOfDaysInMonth(
            currentDate.getMonth(),
            currentDate.getFullYear()
          )
        );
        newDate.setDate(date);
        newDate.setHours(0, 0, 0, 0);

        currentMonthDate = newDate;

        dateAxisAdapter.scrollToDate(newDate);
      }
    }

    dateAxisAdapter.onScroll = nullableScroll;
    dateAxisAdapter.onScrollStart = onDateScrollStart;
    dateAxisAdapter.onScrollEnd = onDateScrollEnd;

    monthAxisAdapter.onScroll = nullableScroll;
    monthAxisAdapter.onScrollStart = onMonthScrollStart;
    monthAxisAdapter.onScrollEnd = onMonthScrollEnd;
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
          height: "87px",
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
