// ExpensesChart.jsx
import { useMemo, useRef, useLayoutEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./ExpensesChart.module.scss";

const CATEGORY_META = {
  food: { name: "Еда", color: "#d9b3ff" },
  transport: { name: "Транспорт", color: "#ffb84d" },
  housing: { name: "Жилье", color: "#66e0ff" },
  joy: { name: "Развлечения", color: "#a6a6ff" },
  education: { name: "Образование", color: "#ccff33" },
  others: { name: "Другое", color: "#ffb3b3" },
};

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

// ---- helpers for dates
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

// ---- width hook to size tick slots
function useContainerWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);

  useLayoutEffect(() => {
    if (!ref.current) return;

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        const cr = entries[0]?.contentRect;
        if (cr?.width) setW(cr.width);
      });
      ro.observe(ref.current);
    } else {
      // fallback
      const handler = () => setW(ref.current?.clientWidth || 0);
      handler();
      window.addEventListener("resize", handler);
      return () => window.removeEventListener("resize", handler);
    }
    return () => ro && ro.disconnect();
  }, []);

  return [ref, w];
}

// ---- custom X axis tick with ellipsis (HTML inside SVG)
const XAxisTick = ({ x, y, payload, slotWidth = 60, fontSize = 12 }) => {
  const w = Math.max(32, Math.floor(slotWidth) - 8); // небольшие поля
  return (
    <foreignObject x={x - w / 2} y={y + 6} width={w} height={20}>
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "center",
          fontSize,
          lineHeight: "14px",
        }}
        title={payload?.value}
      >
        {payload?.value}
      </div>
    </foreignObject>
  );
};

export default function ExpensesChart({
  transaction = [],
  loading = false,
  error = null,
  period,
}) {
  // ---- aggregate data by category
  const computed = useMemo(() => {
    const RU_TO_KEY = Object.fromEntries(
      Object.entries(CATEGORY_META).map(([key, meta]) => [
        meta.name.toLowerCase(),
        key,
      ])
    );

    const normCategory = (raw) => {
      if (!raw) return "others";
      const s = String(raw).trim().toLowerCase();
      if (CATEGORY_META[s]) return s;
      if (RU_TO_KEY[s]) return RU_TO_KEY[s];
      if (s === "other") return "others";
      return "others";
    };

    const normAmount = (t) => {
      const v = t.sum ?? t.amount ?? t.value ?? t.price ?? 0;
      const n = Number(String(v).replace(/[^\d.-]/g, ""));
      return Number.isFinite(n) ? n : 0;
    };

    const acc = new Map();
    for (const t of transaction || []) {
      const key = normCategory(
        t.category ??
          t.categoryName ??
          t.category_name ??
          t?.category?.name ??
          t?.category?.code
      );
      const sum = normAmount(t);
      acc.set(key, (acc.get(key) || 0) + sum);
    }

    return Object.entries(CATEGORY_META).map(([apiKey, meta]) => ({
      name: meta.name,
      value: acc.get(apiKey) || 0,
      color: meta.color,
    }));
  }, [transaction]);

  // ---- subtitle
  const subtitleNode = useMemo(() => {
    const s = toDate(period?.start);
    const e = toDate(period?.end);
    if (s && e) {
      if (isSameDay(s, e)) {
        return (
          <>
            Расходы за <strong>{formatRuGenitive(s)}</strong>
          </>
        );
      }
      return (
        <>
          Расходы за <strong>{formatRuGenitive(s)}</strong> —{" "}
          <strong>{formatRuGenitive(e)}</strong>
        </>
      );
    }
    if (s)
      return (
        <>
          Расходы за <strong>{formatRuGenitive(s)}</strong>
        </>
      );
    return (
      <>
        Расходы за <strong>весь период</strong>
      </>
    );
  }, [period?.start, period?.end]);

  const total = computed.reduce((s, x) => s + (x?.value || 0), 0);

  // ---- measure slot width for ticks
  const [wrapRef, width] = useContainerWidth();
  const slotWidth = useMemo(() => {
    const count = Math.max(1, computed.length);
    // немного «приплюснём» чтобы учесть внутренние отступы графика
    return Math.max(40, Math.floor(width / count) - 8);
  }, [width, computed.length]);

  return (
    <div className={styles.container}>
      <h2 className={styles.total}>{total.toLocaleString("ru-RU")} ₽</h2>
      <p className={styles.subtitle}>{subtitleNode}</p>

      <div ref={wrapRef} className={styles.graph__container}>
        <ResponsiveContainer width="100%" height={424}>
          <BarChart data={computed} barCategoryGap="10%">
            <XAxis
              dataKey="name"
              interval={0} // показываем все подписи
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              // Кастомный тик с обрезкой '…' в границах своей ячейки
              tick={<XAxisTick slotWidth={slotWidth} fontSize={12} />}
            />
            <YAxis hide domain={[0, (max) => max * 1.1]} />
            <Bar
              dataKey="value"
              radius={[12, 12, 12, 12]}
              maxBarSize={520}
              isAnimationActive={!loading}
            >
              {computed.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => `${Number(v).toLocaleString("ru-RU")} ₽`}
                fill="#000"
                fontSize={16}
                fontWeight={600}
                fontFamily="Montserrat, Arial, sans-serif"
                fontStyle="normal"
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
    </div>
  );
}
