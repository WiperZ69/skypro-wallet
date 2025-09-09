import { useContext, useState } from 'react'
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
	try {
		const [y, m, d] = yyyyMMdd.split('-')
		return `${Number(m)}-${Number(d)}-${y}`
	} catch {
		return null
	}
}

const toInputDate = dateStr => {
	try {
		const d = new Date(dateStr)
		if (isNaN(d)) return ''
		const yyyy = d.getFullYear()
		const mm = String(d.getMonth() + 1).padStart(2, '0')
		const dd = String(d.getDate()).padStart(2, '0')
		return `${yyyy}-${mm}-${dd}`
	} catch {
		return ''
	}
}

export const NewExpense = ({ onBack }) => {
	const { addExpense, loading } = useContext(ExpenseContext)
	const [description, setDescription] = useState('')
	const [category, setCategory] = useState('food')
	const [date, setDate] = useState('')
	const [sum, setSum] = useState('')
	const [errors, setErrors] = useState({})

	const resetForm = () => {
		setDescription('')
		setCategory('food')
		setDate('')
		setSum('')
		setErrors({})
	}

	const validateForm = () => {
		const newErrors = {}
		if (description.trim().length < 4) {
			newErrors.description = 'Описание должно быть не менее 4 символов'
		}
		if (!sum || Number(sum) <= 0) {
			newErrors.sum = 'Сумма должна быть больше 0'
		}
		if (!date) {
			newErrors.date = 'Выберите дату'
		}
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSave = async () => {
		if (!validateForm()) return

		const payload = {
			description: description.trim(),
			category,
			date: toApiDate(date),
			sum: parseFloat(sum),
		}

		if (!payload.date) {
			setErrors(prev => ({ ...prev, date: 'Неверный формат даты' }))
			return
		}

		try {
			await addExpense(payload)
			resetForm()
		} catch (error) {
			setErrors({ form: 'Ошибка при добавлении расхода' })
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.box}>
				{onBack && (
					<button
						onClick={onBack}
						className={styles.backButton}
						aria-label='Вернуться к списку'
					>
						<svg
							width='12'
							height='12'
							viewBox='0 0 12 12'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M8.44425 0.166748H3.55591C1.43258 0.166748 0.166748 1.43258 0.166748 3.55591V8.43841C0.166748 10.5676 1.43258 11.8334 3.55591 11.8334H8.43841C10.5617 11.8334 11.8276 10.5676 11.8276 8.44425V3.55591C11.8334 1.43258 10.5676 0.166748 8.44425 0.166748ZM9.50008 6.43758H3.55591L5.31175 8.19341C5.48091 8.36258 5.48091 8.64258 5.31175 8.81175C5.22425 8.89925 5.11341 8.94008 5.00258 8.94008C4.89175 8.94008 4.78091 8.89925 4.69341 8.81175L2.19091 6.30925C2.10925 6.22758 2.06258 6.11675 2.06258 6.00008C2.06258 5.88341 2.10925 5.77258 2.19091 5.69091L4.69341 3.18841C4.86258 3.01925 5.14258 3.01925 5.31175 3.18841C5.48091 3.35758 5.48091 3.63758 5.31175 3.80675L3.55591 5.56258H9.50008C9.73925 5.56258 9.93758 5.76091 9.93758 6.00008C9.93758 6.23925 9.73925 6.43758 9.50008 6.43758Z'
								fill='#999999'
							/>
						</svg>
						Мои расходы
					</button>
				)}
				<h2 className={styles.title}>Новый расход</h2>
			</div>

			{errors.form && <p className={styles.error}>{errors.form}</p>}

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
					aria-describedby={
						errors.description ? 'description-error' : undefined
					}
				/>
				{errors.description && (
					<p id='description-error' className={styles.error}>
						{errors.description}
					</p>
				)}
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
							aria-pressed={category === value}
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
					onChange={e => setDate(e.target.value)}
					className={styles.input}
					aria-describedby={errors.date ? 'date-error' : undefined}
				/>
				{errors.date && (
					<p id='date-error' className={styles.error}>
						{errors.date}
					</p>
				)}
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
					aria-describedby={errors.sum ? 'sum-error' : undefined}
				/>
				{errors.sum && (
					<p id='sum-error' className={styles.error}>
						{errors.sum}
					</p>
				)}
			</div>

			<div className={styles.buttons}>
				<Button onClick={handleSave} disabled={loading}>
					{loading ? 'Сохраняем…' : 'Добавить новый расход'}
				</Button>
			</div>
		</div>
	)
}
