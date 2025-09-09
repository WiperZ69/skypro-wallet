import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";
import Calendar from "../Calendar/Calendar/Calendar";
import ExpensesChart from "../expense/ExpensesChart/ExpensesChart";
import styles from "./Spending.module.scss";
import { getTransactionByPeriod } from "../../services/api";
import { AuthContext } from "../../provider/AuthProvider";

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
const addMidNight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const getMonthAdges = (d) => ({
  start: new Date(d.getFullYear(), d.getMonth(), 1),
  end: new Date(d.getFullYear(), d.getMonth() + 1, 0),
});

const Spending = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [selectedDate, setSelectedDate] = useState(() =>
    buildDateObj(new Date())
  );
  const [selectedRange, setSelectedRange] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transaction, setTransaction] = useState([]);

  // переключение только классами (CSS), без хуков ширины
  const [mobileView, setMobileView] = useState("chart"); // 'chart' | 'calendar'

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
      const d = addMidNight(selectedDate.date);
      return { start: d, end: d };
    }
    const today = new Date();
    const { start, end } = getMonthAdges(today);
    return { start: addMidNight(start), end: addMidNight(end) };
  }, [selectedRange?.startDate, selectedRange?.endDate, selectedDate?.date]);

  useEffect(() => {
    let aborted = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const list = await getTransactionByPeriod({
          start: period.start,
          end: period.end,
          token: user.token,
        });
        if (!aborted) setTransaction(list);
      } catch (e) {
        if (!aborted) {
          setError(e?.message || "не удалось получить данные");
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
  }, [period.start, period.end, user.token]);

  useEffect(() => {
    if (location.pathname === "/spending") {
      const today = new Date();
      setSelectedDate(buildDateObj(today));
      setSelectedRange(null);
      setMobileView("chart");
    }
  }, [location.pathname]);

  const chartProps = { transaction, loading, error, period };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Анализ расходов</h1>

      <div className={styles.content}>
        <div
          className={cn(
            styles.left,
            styles.mobileBlock,
            mobileView === "chart" && styles.hiddenMob
          )}
        >
          <Calendar
            onSelect={(dateObj) => setSelectedDate(dateObj)}
            onRangeSelect={(range) => setSelectedRange(range)}
          />
        </div>

        <div
          className={cn(
            styles.right,
            styles.mobileBlock,
            mobileView === "calendar" && styles.hiddenMob
          )}
        >
          <ExpensesChart {...chartProps} />
        </div>
      </div>

      <div className={styles.mobileControls}>
        <button
          type="button"
          className={cn(
            styles.switchBtn,
            mobileView !== "chart" && styles.hiddenMob
          )}
          onClick={() => setMobileView("calendar")}
        >
          Выбрать другой период
        </button>
        <button
          type="button"
          className={cn(
            styles.switchBtn,
            mobileView !== "calendar" && styles.hiddenMob
          )}
          onClick={() => setMobileView("chart")}
        >
          Показать график
        </button>
      </div>
    </div>
  );
};

export default Spending;
