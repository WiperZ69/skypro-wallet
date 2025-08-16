import { useContext } from 'react'
import { ExpenseContext } from '../../provider/ExpenseProvider'
import styles from './Expense.module.scss'
import { ExpenseTable } from './ExpenseTable/ExpenseTable'
import { NewExpense } from './NewExpense/NewExpense'

export const Expense = () => {
	const { loading, error } = useContext(ExpenseContext)

	return (
		<div className={styles.expense}>
			<h1 className={styles.title}>Мои расходы</h1>
			{error && <p className={styles.error}>{error}</p>}

			<div className={styles.content}>
				<ExpenseTable loading={loading} />
				<NewExpense />
			</div>
		</div>
	)
}
