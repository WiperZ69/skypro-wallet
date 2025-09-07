// src/components/Spending/Spending.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { data, useLocation } from "react-router-dom";
import Calendar from "../Calendar/Calendar/Calendar";
import ExpensesChart from "../expense/ExpensesChart/ExpensesChart";
import styles from "./Spending.module.scss";
import { getTransactionByPeriod } from "../../services/api";
import { AuthContext } from "../../provider/AuthProvider";

const BREAKPOINT = 672;
const MONTHS_RU = [
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

function buildDateObj(d) {
  return {
    day: d.getDate(),
    month: MONTHS_RU[d.getMonth()],
    year: String(d.getFullYear()),
    date: d,
  };
}

const addMidNight = (d) => {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const getMonthAdges = (d) => {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return {
    start,
    end,
  };
};
const Spending = () => {
  const location = useLocation();

  const { user } = useContext(AuthContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log(selectedDate);

  const [selectedRange, setSelectedRange] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState([]);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= BREAKPOINT : false
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const [mobileView, setMobileView] = useState("chart");

  const period = useMemo(() => {
    if (
      selectedRange &&
      selectedRange.startDate instanceof Date &&
      selectedRange.endDate instanceof Date
    ) {
      const start = addMidNight(selectedRange.startDate);
      const end = addMidNight(selectedRange.endDate);
      return start <= end ? { start, end } : { start: end, end: start };
    }
    if (selectedDate?.date instanceof Date) {
      const { start, end } = getMonthAdges(selectedDate.date);
      return { start: addMidNight(start), end: addMidNight(end) };
    }
    const today = new Date();
    const { start, end } = getMonthAdges(today);
    return { start: addMidNight(start), end: addMidNight(end) };
  });

  useEffect(() => {
    let aborted = false;
    // let start = selectedDate.d;
    // let end = selectedDate.d;
    // let period = { start, end };
    async function load() {
      setLoading(true);
      setError(null);
      const params = {
        start: period.start,
        end: period.end,
        token: user.token,
      };
      try {
        const data = await getTransactionByPeriod({
          params,
        });
        if (!aborted) setTransaction(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!aborted) {
          setError(error?.message || "не удалось получить данные");
          setTransaction([]);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    load();
    return () => {
      aborted = true;
    };
  }, [period.start, period.end]);

  useEffect(() => {
    if (location.pathname === "/spending") {
      const today = new Date();
      setSelectedDate(today);
      setSelectedRange(null);
      setMobileView("chart");
    }
  }, [location.pathname]);

  const chartProps = { transaction, loading, error, period };

  if (isMobile) {
    if (mobileView === "chart") {
      return (
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Аналитика расходов</h1>

          <ExpensesChart date={selectedDate} range={selectedRange} />

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

    return (
      <div className={styles.wrapper}>
        <div className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => setMobileView("chart")}
            aria-label="Назад к графику"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.44425 0.166748H3.55591C1.43258 0.166748 0.166748 1.43258 0.166748 3.55591V8.43841C0.166748 10.5676 1.43258 11.8334 3.55591 11.8334H8.43841C10.5617 11.8334 11.8276 10.5676 11.8276 8.44425V3.55591C11.8334 1.43258 10.5676 0.166748 8.44425 0.166748ZM9.50008 6.43758H3.55591L5.31175 8.19341C5.48091 8.36258 5.48091 8.64258 5.31175 8.81175C5.22425 8.89925 5.11341 8.94008 5.00258 8.94008C4.89175 8.94008 4.78091 8.89925 4.69341 8.81175L2.19091 6.30925C2.10925 6.22758 2.06258 6.11675 2.06258 6.00008C2.06258 5.88341 2.10925 5.77258 2.19091 5.69091L4.69341 3.18841C4.86258 3.01925 5.14258 3.01925 5.31175 3.18841C5.48091 3.35758 5.48091 3.63758 5.31175 3.80675L3.55591 5.56258H9.50008C9.73925 5.56258 9.93758 5.76091 9.93758 6.00008C9.93758 6.23925 9.73925 6.43758 9.50008 6.43758Z"
                fill="#999999"
              />
            </svg>
            Анализ расходов
          </button>
          <h1 className={styles.title}>Выбор периода</h1>
        </div>

        <Calendar
          onSelect={(dateObj) => setSelectedDate(dateObj)}
          onRangeSelect={(range) => setSelectedRange(range)}
        />

        <div className={styles.bottomSpace} />

        <button
          type="button"
          className={styles.switchBtn}
          onClick={() => setMobileView("chart")}
        >
          Показать график
        </button>
      </div>
    );
  }

  // ----- ДЕСКТОП: два блока рядом (как было) -----
  return (
    <div>
      <h1 className={styles.title}>Анализ расходов</h1>

      <div className={styles.content}>
        <div className={styles.left}>
          <Calendar
            onSelect={(dateObj) => setSelectedDate(dateObj)}
            onRangeSelect={(range) => setSelectedRange(range)}
          />
        </div>

        <div className={styles.right}>
          <ExpensesChart {...chartProps} />
        </div>
      </div>
    </div>
  );
};

export default Spending;
