import { useContext, useEffect, useState } from 'react'
import { ExpenseContext } from '../../../provider/ExpenseProvider'
import Button from '../../ui/Button/Button'
import { Icons } from '../../ui/Icons/Icons'
import styles from './NewExpense.module.scss'

const CATEGORIES = [
	{ value: 'food', label: 'Еда', Icon: 'food' },
	{ value: 'transport', label: 'Транспорт', Icon: 'transport' },
	{ value: 'housing', label: 'Жилье', Icon: 'housing' },
	{ value: 'joy', label: 'Развлечения', Icon: 'joy' },
	{ value: 'education', label: 'Образование', Icon: 'education' },
	{ value: 'others', label: 'Другое', Icon: 'others' },
]

const toApiDate = yyyyMMdd => {
	const [y, m, d] = yyyyMMdd.split('-')
	return `${Number(m)}-${Number(d)}-${y}`
}

const toInputDate = dateStr => {
	const d = new Date(dateStr)
	if (!isNaN(d)) {
		const yyyy = d.getFullYear()
		const mm = String(d.getMonth() + 1).padStart(2, '0')
		const dd = String(d.getDate()).padStart(2, '0')
		return `${yyyy}-${mm}-${dd}`
	}
	return ''
}

export const NewExpense = () => {
	const {
		addExpense,
		editExpense,
		editingExpense,
		clearEditingExpense,
		loading,
	} = useContext(ExpenseContext)

	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('food')
	const [date, setDate] = useState('')
	const [sum, setSum] = useState('')

	// Если выбрали расход для редактирования → заполняем форму
	useEffect(() => {
		if (editingExpense) {
			setDescription(editingExpense.description ?? '')
			setCategory(editingExpense.category ?? 'food')
			setDate(toInputDate(editingExpense.date))
			setSum(String(editingExpense.sum ?? ''))
		}
	}, [editingExpense])

	const resetForm = () => {
		setDescription('')
		setCategory('food')
		setDate('')
		setSum('')
	}

	const handleSave = async () => {
		if (description.trim().length < 4) return
		if (!sum || Number(sum) <= 0) return
		if (!date) return

		const payload = {
			description: description.trim(),
			category,
			date: toApiDate(date),
			sum: parseFloat(sum),
		}

		if (editingExpense) {
			await editExpense(editingExpense._id, payload)
			clearEditingExpense()
		} else {
			await addExpense(payload)
		}

		resetForm()
	}

	return (
		<div className={styles.container}>
			<h2 className={styles.title}>
				{editingExpense ? 'Редактировать расход' : 'Новый расход'}
			</h2>

			<div className={styles.formGroup}>
				<label htmlFor='description' className={styles.label}>
					Описание
				</label>
				<input
					type='text'
					id='description'
					value={description}
					onChange={e => setDescription(e.target.value)}
					placeholder='Введите описание'
					className={styles.input}
				/>
			</div>

			<div className={styles.formGroup}>
				<label className={styles.label}>Категория</label>
				<div className={styles.categoryButtons}>
					{CATEGORIES.map(({ value, label, Icon }) => (
						<button
							key={value}
							onClick={() => setCategory(value)}
							type='button'
							className={`${styles.categoryButton} ${category === value ? styles.active : ''}`}
						>
							<Icons
								name={Icon}
								className={styles.categoryIcons}
								fill='currentColor'
							/>
							{label}
						</button>
					))}
				</div>
			</div>

			<div className={styles.formGroup}>
				<label htmlFor='date' className={styles.label}>
					Дата
				</label>
				<input
					type='date'
					id='date'
					value={date}
					placeholder='Введите дату'
					onChange={e => setDate(e.target.value)}
					className={styles.input}
				/>
			</div>

			<div className={styles.formGroup}>
				<label htmlFor='sum' className={styles.label}>
					Сумма
				</label>
				<input
					type='number'
					id='sum'
					value={sum}
					onChange={e => setSum(e.target.value)}
					placeholder='Введите сумму'
					min='0'
					step='1'
					className={styles.input}
				/>
			</div>

			<div className={styles.buttons}>
				<Button onClick={handleSave} disabled={loading}>
					{loading ? 'Сохраняем…' : 'Добавить новый расход'}
				</Button>
			</div>
		</div>
	)
}
