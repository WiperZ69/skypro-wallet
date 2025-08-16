import React, { useMemo, useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import styles from "./ExpensesChart.module.scss";
import { ExpenseContext } from "../../../provider/ExpenseProvider"; // путь из src/components/expense/ExpensesChart/...

// соответствие ключей API → отображаемые подписи и цвета
const CATEGORY_META = {
  food: { name: "Еда", color: "#d9b3ff" },
  transport: { name: "Транспорт", color: "#ffb84d" },
  housing: { name: "Жилье", color: "#66e0ff" },
  joy: { name: "Развлечения", color: "#a6a6ff" },
  education: { name: "Образование", color: "#ccff33" },
  others: { name: "Другое", color: "#ffb3b3" },
};

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
const RU_MONTHS_GEN = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const monthIndexFromRu = (name) => {
  if (!name) return 0;
  const idx = RU_MONTHS.findIndex(
    (m) => m.toLowerCase() === String(name).toLowerCase()
  );
  return idx >= 0 ? idx : 0;
};

const toDate = (x) => {
  if (!x) return null;
  if (x instanceof Date)
    return new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const d = new Date(x);
  return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const isSameDay = (d1, d2) =>
  d1 &&
  d2 &&
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const formatRuGenitive = (d) =>
  `${d.getDate()} ${RU_MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;

export default function ExpensesChart({ date, range }) {
  const { expenses } = useContext(ExpenseContext);

  // нормализованный диапазон (или null)
  const normRange = useMemo(() => {
    if (!range) return null;
    const s = toDate(range.startDate);
    const e = toDate(range.endDate);
    return s && e ? { start: s, end: e } : null;
  }, [range?.startDate, range?.endDate]);

  // отфильтрованные транзакции
  const filtered = useMemo(() => {
    const items = Array.isArray(expenses) ? expenses : [];
    if (normRange) {
      return items.filter((t) => {
        const d = toDate(t.date);
        return d && d >= normRange.start && d <= normRange.end;
      });
    }
    if (date?.day && date?.month && date?.year) {
      const target = new Date(
        Number(date.year),
        monthIndexFromRu(date.month),
        Number(date.day)
      );
      return items.filter((t) => isSameDay(toDate(t.date), target));
    }
    return items; // если ничего не выбрано — весь период
  }, [
    expenses,
    normRange?.start?.getTime(),
    normRange?.end?.getTime(),
    date?.day,
    date?.month,
    date?.year,
  ]);

  // агрегируем суммы по категориям API-ключей
  const computed = useMemo(() => {
    const acc = new Map(); // key: apiCategory, value: sum
    for (const t of filtered) {
      const key = t.category; // 'food' | 'transport' | ...
      const sum = Number(t.sum) || 0;
      acc.set(key, (acc.get(key) || 0) + sum);
    }
    // превращаем в массив для графика, упорядоченный как в CATEGORY_META
    return Object.entries(CATEGORY_META).map(([apiKey, meta]) => ({
      name: meta.name,
      value: acc.get(apiKey) || 0,
      color: meta.color,
    }));
  }, [filtered]);

  const subtitleNode = useMemo(() => {
    if (normRange) {
      return (
        <>
          Расходы за <strong>{formatRuGenitive(normRange.start)}</strong> —{" "}
          <strong>{formatRuGenitive(normRange.end)}</strong>
        </>
      );
    }
    if (date?.day && date?.month && date?.year) {
      const d = new Date(
        Number(date.year),
        monthIndexFromRu(date.month),
        Number(date.day)
      );
      return (
        <>
          Расходы за <strong>{formatRuGenitive(d)}</strong>
        </>
      );
    }
    return (
      <>
        Расходы за <strong>весь период</strong>
      </>
    );
  }, [
    normRange?.start?.getTime(),
    normRange?.end?.getTime(),
    date?.day,
    date?.month,
    date?.year,
  ]);

  const total = computed.reduce((s, x) => s + (x?.value || 0), 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.total}>{total.toLocaleString("ru-RU")} ₽</h2>
      <p className={styles.subtitle}>{subtitleNode}</p>

      <ResponsiveContainer width="100%" height={424}>
        <BarChart data={computed} barCategoryGap="10%">
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 14 }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />
          <YAxis hide domain={[0, (max) => max * 1.1]} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={520}>
            {computed.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => `${Number(v).toLocaleString("ru-RU")} ₽`}
              fill="#000"
              fontSize={18}
            />
          </Bar>
          <Tooltip
            formatter={(v) => [
              `${Number(v).toLocaleString("ru-RU")} ₽`,
              "Сумма",
            ]}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
