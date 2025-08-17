import { useContext, useEffect, useState } from 'react'
import { ExpenseContext } from '../../provider/ExpenseProvider'
import { useMobileScreen } from '../../provider/MobileScreenProvider'
import styles from './Expense.module.scss'
import { ExpenseTable } from './ExpenseTable/ExpenseTable'
import { NewExpense } from './NewExpense/NewExpense'

export const Expense = () => {
	const { loading, error, deleteExpense } = useContext(ExpenseContext)
	const [selectedExpense, setSelectedExpense] = useState(null)
	const { mobileScreen, setMobileScreen } = useMobileScreen()
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 672)

	// Handle window resize
	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth <= 672)
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return (
		<div className={styles.expense}>
			<div className={styles.box}>
				{mobileScreen === 'list' && (
					<h1 className={styles.title}>Мои расходы</h1>
				)}
				{isMobile ? (
					mobileScreen === 'list' ? (
						<button
							className={styles.link}
							onClick={() => setMobileScreen('new')}
						>
							<svg
								width='12'
								height='12'
								viewBox='0 0 12 12'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M5.99984 0.166626C2.78567 0.166626 0.166504 2.78579 0.166504 5.99996C0.166504 9.21413 2.78567 11.8333 5.99984 11.8333C9.214 11.8333 11.8332 9.21413 11.8332 5.99996C11.8332 2.78579 9.214 0.166626 5.99984 0.166626ZM8.33317 6.43746H6.43734V8.33329C6.43734 8.57246 6.239 8.77079 5.99984 8.77079C5.76067 8.77079 5.56234 8.57246 5.56234 8.33329V6.43746H3.6665C3.42734 6.43746 3.229 6.23913 3.229 5.99996C3.229 5.76079 3.42734 5.56246 3.6665 5.56246H5.56234V3.66663C5.56234 3.42746 5.76067 3.22913 5.99984 3.22913C6.239 3.22913 6.43734 3.42746 6.43734 3.66663V5.56246H8.33317C8.57234 5.56246 8.77067 5.76079 8.77067 5.99996C8.77067 6.23913 8.57234 6.43746 8.33317 6.43746Z'
									fill='black'
								/>
							</svg>
							Новый расход
						</button>
					) : (
						''
					)
				) : (
					''
				)}
			</div>
			{error && <p className={styles.error}>{error}</p>}

			{isMobile ? (
				mobileScreen === 'list' ? (
					<>
						<ExpenseTable
							loading={loading}
							isMobile
							selectedExpense={selectedExpense}
							setSelectedExpense={setSelectedExpense}
						/>
						<button
							className={styles.deleteButton}
							style={{ display: selectedExpense ? 'block' : 'none' }}
							onClick={() => {
								if (selectedExpense) {
									deleteExpense(selectedExpense) // Use context value
									setSelectedExpense(null)
								}
							}}
							aria-label='Удалить выбранный расход'
						>
							Удалить расход
						</button>
						<button
							className={styles.addButton}
							onClick={() => setMobileScreen('new')}
							aria-label='Добавить новый расход'
						>
							Новый расход
						</button>
					</>
				) : (
					<NewExpense onBack={() => setMobileScreen('list')} />
				)
			) : (
				<div className={styles.content}>
					<ExpenseTable loading={loading} />
					<NewExpense />
				</div>
			)}
		</div>
	)
}
