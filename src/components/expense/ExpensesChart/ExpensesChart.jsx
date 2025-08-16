// ExpensesChart.jsx — одна дата ИЛИ диапазон (CSS Modules + Recharts)
import React, { useMemo } from "react";
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

// ---- Цвета и категории ----
const categoryColors = {
  Еда: "#d9b3ff",
  Транспорт: "#ffb84d",
  Жилье: "#66e0ff",
  Развлечения: "#a6a6ff",
  Образование: "#ccff33",
  Другое: "#ffb3b3",
};
const categories = Object.keys(categoryColors);

// ---- Моки/генерация ----
const mockDataByDate = {
  "10.07.2024": [
    { name: "Еда", value: 3590, color: "#d9b3ff" },
    { name: "Транспорт", value: 1835, color: "#ffb84d" },
    { name: "Жилье", value: 0, color: "#66e0ff" },
    { name: "Развлечения", value: 1250, color: "#a6a6ff" },
    { name: "Образование", value: 600, color: "#ccff33" },
    { name: "Другое", value: 2306, color: "#ffb3b3" },
  ],
  "11.07.2024": [
    { name: "Еда", value: 2400, color: "#d9b3ff" },
    { name: "Транспорт", value: 900, color: "#ffb84d" },
    { name: "Жилье", value: 0, color: "#66e0ff" },
    { name: "Развлечения", value: 3000, color: "#a6a6ff" },
    { name: "Образование", value: 0, color: "#ccff33" },
    { name: "Другое", value: 1500, color: "#ffb3b3" },
  ],
  "12.07.2024": [
    { name: "Еда", value: 4100, color: "#d9b3ff" },
    { name: "Транспорт", value: 1200, color: "#ffb84d" },
    { name: "Жилье", value: 8500, color: "#66e0ff" },
    { name: "Развлечения", value: 600, color: "#a6a6ff" },
    { name: "Образование", value: 950, color: "#ccff33" },
    { name: "Другое", value: 1800, color: "#ffb3b3" },
  ],
  "13.08.2024": [
    { name: "Еда", value: 3300, color: "#d9b3ff" },
    { name: "Транспорт", value: 750, color: "#ffb84d" },
    { name: "Жилье", value: 0, color: "#66e0ff" },
    { name: "Развлечения", value: 5000, color: "#a6a6ff" },
    { name: "Образование", value: 2000, color: "#ccff33" },
    { name: "Другое", value: 1200, color: "#ffb3b3" },
  ],
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

const formatKeyFromObj = (dateObj) => {
  if (!dateObj) return null;
  const { day, month, year } = dateObj;
  const m = monthIndexFromRu(month) + 1;
  const dd = String(day).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${dd}.${mm}.${year}`;
};

const formatRuGenitive = (d) => {
  const dd = d.getDate();
  const mm = d.getMonth();
  const yy = d.getFullYear();
  return `${dd} ${RU_MONTHS_GEN[mm]} ${yy}`;
};

// ——— НОРМАЛИЗАЦИЯ ДАТ (приходит Date | строка | число)
const toDate = (x) => {
  if (!x) return null;
  if (x instanceof Date)
    return new Date(x.getFullYear(), x.getMonth(), x.getDate());
  const d = new Date(x);
  return isNaN(d) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const enumerateDaysInclusive = (startDate, endDate) => {
  const arr = [];
  const s = toDate(startDate),
    e = toDate(endDate);
  if (!s || !e) return arr;
  let cur = new Date(s);
  while (cur <= e) {
    arr.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return arr;
};

const generateRandomData = () =>
  categories.map((name) => {
    const base =
      name === "Еда"
        ? 2000
        : name === "Транспорт"
          ? 900
          : name === "Жилье"
            ? 3000
            : name === "Развлечения"
              ? 1600
              : name === "Образование"
                ? 800
                : 1200;
    const jitter = Math.floor(Math.random() * base * 0.4);
    return { name, value: base + jitter, color: categoryColors[name] };
  });

const getDataForDay = (dateObj) => {
  const key = `${String(dateObj.getDate()).padStart(2, "0")}.${String(
    dateObj.getMonth() + 1
  ).padStart(2, "0")}.${dateObj.getFullYear()}`;
  return mockDataByDate[key] || generateRandomData();
};

const sumByCategory = (lists) => {
  const acc = new Map();
  lists.forEach((arr) => {
    (arr || []).forEach(({ name, value, color }) => {
      const prev = acc.get(name) || {
        name,
        value: 0,
        color: categoryColors[name] || color,
      };
      prev.value += value;
      acc.set(name, prev);
    });
  });
  return Array.from(acc.values());
};

// ----- Компонент -----
export default function ExpensesChart({ date, range }) {
  // нормализованный диапазон
  const normRange = useMemo(() => {
    if (!range) return null;
    const s = toDate(range.startDate);
    const e = toDate(range.endDate);
    return s && e ? { start: s, end: e } : null;
  }, [range?.startDate, range?.endDate]);

  // данные под график
  const computed = useMemo(() => {
    if (normRange) {
      const days = enumerateDaysInclusive(normRange.start, normRange.end);
      const arrays = days.map(getDataForDay);
      const summed = sumByCategory(arrays);
      return summed.length ? summed : generateRandomData();
    }
    const key = date ? formatKeyFromObj(date) : "10.07.2024";
    return mockDataByDate[key] || generateRandomData();
  }, [
    normRange?.start?.getTime(),
    normRange?.end?.getTime(),
    date?.day,
    date?.month,
    date?.year,
  ]);

  // подпись под заголовком — как на скрине
  const subtitleNode = useMemo(() => {
    if (normRange) {
      return (
        <>
          Расходы за <strong>{formatRuGenitive(normRange.start)}</strong>
          {" — "}
          <strong>{formatRuGenitive(normRange.end)}</strong>
        </>
      );
    }
    if (date) {
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
        Расходы за <strong>10 июля 2024</strong>
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

      {/* фиксируем высоту — чтобы ResponsiveContainer точно отрисовался */}
      <ResponsiveContainer width="100%" height={424}>
        <BarChart data={computed} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide domain={[0, (dataMax) => dataMax * 1.1]} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={200}>
            {computed.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
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
