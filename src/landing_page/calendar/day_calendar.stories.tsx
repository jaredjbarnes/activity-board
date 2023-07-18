import { useState } from "react";
import { DayCalendar } from "src/landing_page/calendar/day_calendar.tsx";
import { MonthHeader } from "src/landing_page/calendar/month_header.tsx";
import { DateAxisAdapter } from "src/layouts/scroll/date_axis_adapter.ts";

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
  const [date, setDate] = useState(() => {
    return new Date(2023, 0, 1);
  });

  function next() {
    const nextDate = new Date(date);
    nextDate.setMonth(nextDate.getMonth() + 1);
    setDate(nextDate);
  }

  function prev() {
    const prevDate = new Date(date);
    prevDate.setMonth(prevDate.getMonth() - 1);
    setDate(prevDate);
  }

  return (
    <div>
      <MonthHeader
        date={date}
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
  const [date, setDate] = useState(new Date());
  const [dateAxisAdapter] = useState(() => {
    const dateAxisAdapter = new DateAxisAdapter(
      requestAnimationFrame,
      cancelAnimationFrame
    );
    dateAxisAdapter.onScroll = () => {
      const currentDate = dateAxisAdapter.getCurrentDate();

      if (
        currentDate.getMonth() !== date.getMonth() ||
        currentDate.getFullYear() !== date.getFullYear()
      ) {
        setDate(currentDate);
      }
    };
    return dateAxisAdapter;
  });

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
        date={date}
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
