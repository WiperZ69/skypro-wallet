import { Edit, Trash } from 'lucide-react'
import { useContext, useMemo } from 'react'
import { ExpenseContext } from '../../../provider/ExpenseProvider'
import { Loader } from '../../common/Loader/Loader'
import styles from './ExpenseTable.module.scss'

const CATEGORY_LABELS = {
	food: 'Еда',
	transport: 'Транспорт',
	housing: 'Жилье',
	joy: 'Развлечения',
	education: 'Образование',
	others: 'Другое',
}

const toDisplayDate = iso => {
	try {
		return new Date(iso).toLocaleDateString('ru-RU')
	} catch {
		return iso
	}
}

export const ExpenseTable = ({ loading }) => {
	const { expenses, deleteExpense, setEditingExpense } =
		useContext(ExpenseContext)

	const rows = useMemo(
		() => (Array.isArray(expenses) ? expenses : []),
		[expenses]
	)

	if (loading) {
		return (
			<div className={styles.container}>
				<h2 className={styles.title}>Таблица расходов</h2>
				<Loader />
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>Таблица расходов</h2>
			<div className={styles.tableContainer}>
				<table className={styles.table}>
					<thead>
						<tr>
							<th className={styles.th}>Описание</th>
							<th className={styles.th}>Категория</th>
							<th className={styles.th}>Дата</th>
							<th className={styles.th}>Сумма</th>
							<th className={styles.th}></th>
						</tr>
					</thead>
					<tbody>
						{rows.map(expense => (
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
											onClick={() => deleteExpense(expense._id)}
											className={styles.actionButton}
											title='Удалить'
										>
											<Trash size={16} />
										</button>
										<button
											onClick={() => setEditingExpense(expense)}
											className={styles.actionButton}
											title='Редактировать'
										>
											<Edit size={16} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
