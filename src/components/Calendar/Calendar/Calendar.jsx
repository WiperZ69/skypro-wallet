// Calendar.jsx — выбор одной даты ИЛИ диапазона (CSS Modules)
import React, { useMemo, useState } from "react";
import Day from "../Day/Day";
import styles from "./Calendar.module.scss";

const RU_MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

function sameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
const atMidnight = (d) =>
  d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() : null;

const inRange = (day, start, end) => {
  if (!start || !end) return false;
  const t = atMidnight(day);
  const s = atMidnight(start);
  const e = atMidnight(end);
  return t > s && t < e;
};

export default function Calendar({ onSelect, onRangeSelect }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Тот же список месяцев, что и в walletbase
  const months = useMemo(
    () =>
      [
        { name: "Июль 2024", days: 31 },
        { name: "Август 2024", days: 31 },
        { name: "Сентябрь 2024", days: 30 },
        { name: "Октябрь 2024", days: 31 },
        { name: "Ноябрь 2024", days: 30 },
        { name: "Декабрь 2024", days: 31 },
      ].map(({ name, days }) => {
        const [mn, y] = name.split(" ");
        const monthIndex = RU_MONTHS.indexOf(mn);
        const year = parseInt(y, 10);
        return { name, days, monthIndex, year };
      }),
    []
  );

  const emitSingle = (dateObj) => {
    // одиночная дата наверх
    onSelect &&
      onSelect({
        day: dateObj.getDate(),
        month: RU_MONTHS[dateObj.getMonth()],
        year: String(dateObj.getFullYear()),
        date: new Date(dateObj),
      });
    // и сброс диапазона
    onRangeSelect && onRangeSelect({ startDate: dateObj, endDate: null });
  };

  const emitRange = (a, b) => {
    onRangeSelect && onRangeSelect({ startDate: a, endDate: b });
  };

  const handleDayClick = (dateObj) => {
    if (!startDate) {
      // первая точка диапазона / одиночная дата
      setStartDate(dateObj);
      setEndDate(null);
      emitSingle(dateObj);
      return;
    }
    if (startDate && !endDate) {
      // вторая точка диапазона
      if (dateObj < startDate) {
        setEndDate(startDate);
        setStartDate(dateObj);
        emitRange(dateObj, startDate);
      } else if (dateObj > startDate) {
        setEndDate(dateObj);
        emitRange(startDate, dateObj);
      } else {
        // клик по той же дате — остаёмся на одиночной
        setEndDate(null);
        emitSingle(dateObj);
      }
      return;
    }
    // диапазон уже был — начинаем новый с кликнутой даты
    setStartDate(dateObj);
    setEndDate(null);
    emitSingle(dateObj);
  };

  const renderMonth = (m) => {
    const first = new Date(m.year, m.monthIndex, 1);
    const offset = (first.getDay() + 6) % 7; // пн=0
    const cells = Array.from({ length: offset + m.days }, (_, i) => {
      if (i < offset) return null;
      const day = i - offset + 1;
      return new Date(m.year, m.monthIndex, day);
    });

    return (
      <div className={styles.month} key={m.name}>
        <div className={styles.monthName}>{m.name}</div>
        <div className={styles.daysGrid}>
          {cells.map((d, idx) => {
            if (!d) return <div className={styles.emptyCell} key={idx} />;

            const isStart = sameDay(d, startDate);
            const isEnd = sameDay(d, endDate);
            const middle = inRange(d, startDate, endDate);

            return (
              <Day
                key={d.toISOString()}
                date={d}
                monthName={m.name}
                isStart={isStart}
                isEnd={isEnd}
                isMiddle={middle}
                isActive={isStart || isEnd}
                onClick={handleDayClick}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Период</h2>

      <div className={styles.weekdays}>
        <span className={styles.weekday}>пн</span>
        <span className={styles.weekday}>вт</span>
        <span className={styles.weekday}>ср</span>
        <span className={styles.weekday}>чт</span>
        <span className={styles.weekday}>пт</span>
        <span className={styles.weekday}>сб</span>
        <span className={styles.weekday}>вс</span>
      </div>
      <div className={styles.underscore}></div>

      {months.map(renderMonth)}
    </div>
  );
}
