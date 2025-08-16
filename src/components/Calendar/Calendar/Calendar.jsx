// Calendar.jsx — выбор одной даты ИЛИ диапазона (CSS Modules)
import React, { useMemo, useState, useEffect, useRef } from "react";
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

  // ссылки на DOM-узлы месяцев, чтобы проскроллить к текущему
  const monthRefs = useRef([]);

  const currentYear = new Date().getFullYear();
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const days = new Date(currentYear, monthIndex + 1, 0).getDate();
      const name = `${RU_MONTHS[monthIndex]} ${currentYear}`;
      return { name, days, monthIndex, year: currentYear };
    });
  }, [currentYear]);

  const emitSingle = (dateObj) => {
    onSelect &&
      onSelect({
        day: dateObj.getDate(),
        month: RU_MONTHS[dateObj.getMonth()],
        year: String(dateObj.getFullYear()),
        date: new Date(dateObj),
      });
    onRangeSelect && onRangeSelect({ startDate: dateObj, endDate: null });
  };

  const emitRange = (a, b) => {
    onRangeSelect && onRangeSelect({ startDate: a, endDate: b });
  };

  const handleDayClick = (dateObj) => {
    if (!startDate) {
      setStartDate(dateObj);
      setEndDate(null);
      emitSingle(dateObj);
      return;
    }
    if (startDate && !endDate) {
      if (dateObj < startDate) {
        setEndDate(startDate);
        setStartDate(dateObj);
        emitRange(dateObj, startDate);
      } else if (dateObj > startDate) {
        setEndDate(dateObj);
        emitRange(startDate, dateObj);
      } else {
        setEndDate(null);
        emitSingle(dateObj);
      }
      return;
    }
    setStartDate(dateObj);
    setEndDate(null);
    emitSingle(dateObj);
  };

  // авто-выбор сегодняшнего дня + авто-скролл к текущему месяцу
  useEffect(() => {
    const today = new Date();
    setStartDate(today);
    setEndDate(null);
    emitSingle(today);

    // прокрутка к секции текущего месяца
    const idx = today.getMonth();
    const el = monthRefs.current[idx];
    if (el && typeof el.scrollIntoView === "function") {
      // делаем после отрисовки, чтобы расчёт высот был корректным
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderMonth = (m) => {
    const first = new Date(m.year, m.monthIndex, 1);
    const offset = (first.getDay() + 6) % 7; // пн=0
    const cells = Array.from({ length: offset + m.days }, (_, i) => {
      if (i < offset) return null;
      const day = i - offset + 1;
      return new Date(m.year, m.monthIndex, day);
    });

    return (
      <div
        className={styles.month}
        key={m.name}
        ref={(el) => (monthRefs.current[m.monthIndex] = el)}
      >
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
