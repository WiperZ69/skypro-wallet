import { Edit, Trash } from "lucide-react";
import { useContext, useMemo } from "react";
import { ExpenseContext } from "../../../provider/ExpenseProvider";
import { Loader } from "../../common/Loader/Loader";
import styles from "./ExpenseTable.module.scss";

const CATEGORY_LABELS = {
  food: "Еда",
  transport: "Транспорт",
  housing: "Жилье",
  joy: "Развлечения",
  education: "Образование",
  others: "Другое",
};

const toDisplayDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("ru-RU");
  } catch {
    return iso;
  }
};

export const ExpenseTable = ({ loading }) => {
  const { expenses, deleteExpense, setEditingExpense } =
    useContext(ExpenseContext);

  const rows = useMemo(
    () => (Array.isArray(expenses) ? expenses : []),
    [expenses]
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Таблица расходов</h2>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Таблица расходов</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Описание</th>
              <th className={styles.th}>Категория</th>
              <th className={styles.th}>Дата</th>
              <th className={styles.th}>Сумма</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((expense) => (
              <tr key={expense._id} className={styles.tr}>
                <td className={styles.td}>{expense.description}</td>
                <td className={styles.td}>
                  {CATEGORY_LABELS[expense.category] ?? expense.category}
                </td>
                <td className={styles.td}>{toDisplayDate(expense.date)}</td>
                <td className={styles.td}>{expense.sum} ₽</td>
                <td className={styles.td}>
                  <div className={styles.actions}>
                    <button
                      onClick={() => deleteExpense(enxpense._id)}
                      className={styles.actionButton}
                      title="Удалить"
                    >
                      <svg
                        width="12"
                        height="13"
                        viewBox="0 0 12 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.62 3.29003H9.42L7.73 1.60003C7.595 1.46503 7.375 1.46503 7.235 1.60003C7.1 1.73503 7.1 1.95503 7.235 2.09503L8.43 3.29003H3.57L4.765 2.09503C4.9 1.96003 4.9 1.74003 4.765 1.60003C4.63 1.46503 4.41 1.46503 4.27 1.60003L2.585 3.29003H2.385C1.935 3.29003 1 3.29003 1 4.57003C1 5.05503 1.1 5.37503 1.31 5.58503C1.43 5.71003 1.575 5.77503 1.73 5.81003C1.875 5.84503 2.03 5.85003 2.18 5.85003H9.82C9.975 5.85003 10.12 5.84003 10.26 5.81003C10.68 5.71003 11 5.41003 11 4.57003C11 3.29003 10.065 3.29003 9.62 3.29003Z"
                          fill="#999999"
                        />
                        <path
                          d="M9.52502 6.5H2.43502C2.12502 6.5 1.89002 6.775 1.94002 7.08L2.36002 9.65C2.50002 10.51 2.87502 11.5 4.54002 11.5H7.34502C9.03002 11.5 9.33002 10.655 9.51002 9.71L10.015 7.095C10.075 6.785 9.84002 6.5 9.52502 6.5ZM5.30502 9.725C5.30502 9.92 5.15002 10.075 4.96002 10.075C4.76502 10.075 4.61002 9.92 4.61002 9.725V8.075C4.61002 7.885 4.76502 7.725 4.96002 7.725C5.15002 7.725 5.30502 7.885 5.30502 8.075V9.725ZM7.44502 9.725C7.44502 9.92 7.29002 10.075 7.09502 10.075C6.90502 10.075 6.74502 9.92 6.74502 9.725V8.075C6.74502 7.885 6.90502 7.725 7.09502 7.725C7.29002 7.725 7.44502 7.885 7.44502 8.075V9.725Z"
                          fill="#999999"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
