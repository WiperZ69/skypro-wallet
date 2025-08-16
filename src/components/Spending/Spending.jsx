import React, { useState } from "react";
import styles from "./Spending.module.scss";
import Calendar from "../Calendar/Calendar/Calendar";
import ExpensesChart from "../expense/ExpensesChart/ExpensesChart";

const Spending = () => {
  // одиночная дата (как было)
  const [selectedDate, setSelectedDate] = useState({
    day: 10,
    month: "Июль",
    year: "2024",
    date: new Date("Июль 10, 2024"),
  });

  // НОВОЕ: диапазон дат
  const [selectedRange, setSelectedRange] = useState({
    startDate: null,
    endDate: null,
  });

  return (
    <div>
      <h1 className={styles.title}>Анализ расходов</h1>
      <div className={styles.content}>
        <div className={styles.left}>
          <Calendar
            onSelect={setSelectedDate}
            onRangeSelect={setSelectedRange} // <- ВАЖНО: ловим диапазон из календаря
          />
        </div>
        <div className={styles.right}>
          <ExpensesChart
            date={selectedDate}
            range={selectedRange} // <- ВАЖНО: передаём диапазон в график
          />
        </div>
      </div>
    </div>
  );
};

export default Spending;
