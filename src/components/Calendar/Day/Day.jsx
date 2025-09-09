// Day.jsx — ячейка дня (CSS Modules)
import React from "react";
import styles from "./Day.module.scss";

export default function Day({
  date,
  monthName,
  isStart,
  isEnd,
  isMiddle,
  isActive,
  onClick,
}) {
  const handleClick = () => {
    onClick && onClick(new Date(date));
  };

  const className = [
    styles.cell,
    isActive && styles.active,
    isStart && styles.rangeStart,
    isEnd && styles.rangeEnd,
    isMiddle && styles.rangeMiddle,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      onClick={handleClick}
      className={className}
      title={`${date.getDate()} ${monthName}`}
    >
      {date.getDate()}
    </div>
  );
}
