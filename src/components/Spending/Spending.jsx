// src/components/Spending/Spending.jsx
import React, { useEffect, useState } from "react";
import styles from "./Spending.module.scss";
import Calendar from "../Calendar/Calendar/Calendar";
import ExpensesChart from "../expense/ExpensesChart/ExpensesChart";

const BREAKPOINT = 672; // как и в расходах

const Spending = () => {
  // одиночная дата (как было у тебя)
  const [selectedDate, setSelectedDate] = useState({
    day: 10,
    month: "Июль",
    year: "2024",
    date: new Date("Июль 10, 2024"),
  });

  // диапазон дат для графика (может быть null)
  const [selectedRange, setSelectedRange] = useState(null);

  // определяем мобильный режим
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= BREAKPOINT : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // текущий мобильный экран: 'chart' | 'calendar'
  // по умолчанию — график (требование)
  const [mobileView, setMobileView] = useState("chart");

  // ----- МОБИЛКА: показываем один из экранов -----
  if (isMobile) {
    if (mobileView === "chart") {
      return (
        <div>
          <h1 className={styles.title}>Аналитика расходов</h1>

          <ExpensesChart date={selectedDate} range={selectedRange} />

          {/* Прокладка, чтобы фикс-кнопка не перекрывала контент */}
          <div className={styles.bottomSpace} />

          <button
            type="button"
            className={styles.switchBtn}
            onClick={() => setMobileView("calendar")}
          >
            Выбрать другой период
          </button>
        </div>
      );
    }

    // mobileView === 'calendar'
    return (
      <div>
        <div className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => setMobileView("chart")}
            aria-label="Назад к графику"
          >
            ←
          </button>
          <h1 className={styles.title}>Выбор периода</h1>
        </div>

        <Calendar
          onSelect={(dateObj) => setSelectedDate(dateObj)}
          onRangeSelect={(range) => setSelectedRange(range)}
        />

        {/* Прокладка, чтобы фикс-кнопка не перекрывала контент */}
        <div className={styles.bottomSpace} />

        <button
          type="button"
          className={styles.switchBtn}
          onClick={() => setMobileView("chart")}
        >
          Выбрать период
        </button>
      </div>
    );
  }

  // ----- ДЕСКТОП: два блока рядом (как было) -----
  return (
    <div>
      <h1 className={styles.title}>Аналитика расходов</h1>

      <div className={styles.content}>
        <div className={styles.left}>
          <Calendar
            onSelect={(dateObj) => setSelectedDate(dateObj)}
            onRangeSelect={(range) => setSelectedRange(range)}
          />
        </div>

        <div className={styles.right}>
          <ExpensesChart date={selectedDate} range={selectedRange} />
        </div>
      </div>
    </div>
  );
};

export default Spending;
