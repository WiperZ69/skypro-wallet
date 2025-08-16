import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../provider/AuthProvider'
import { signIn, signUp } from '../../services/auth'
import styles from '../AuthForm/AuthForm.module.scss'
//sssss
const ERROR_MESSAGE =
	'Упс! Введённые вами данные некорректны. Введите данные корректно и повторите попытку.'

const ACTIVE_BG_COLOR = '#F2EAFF'
const ACTIVE_BORDER_COLOR = '#7334EA'

const AuthForm = ({ isSignUp }) => {
	const navigate = useNavigate()
	const [isSubmitted, setIsSubmitted] = useState(false)

	const { updateUserInfo } = useContext(AuthContext)
	const [loading, setLoading] = useState(false)

	const [formData, setFormData] = useState({
		name: '',
		login: '',
		password: '',
	})

	const [errors, setErrors] = useState({
		name: false,
		login: false,
		password: false,
	})

	const [isActive, setIsActive] = useState({
		name: false,
		login: false,
		password: false,
	})

	const [error, setError] = useState('')

	const validateForm = (data = formData) => {
		const newErrors = { name: false, login: false, password: false }
		let isValid = true

		if (isSignUp && !data.name.trim()) {
			newErrors.name = true
			isValid = false
		}
		if (!data.login.trim()) {
			newErrors.login = true
			isValid = false
		}
		if (!data.password.trim()) {
			newErrors.password = true
			isValid = false
		}

		setErrors(newErrors)

		if (!isValid) {
			setError(ERROR_MESSAGE)
		} else {
			setError('')
		}

		return isValid
	}

	const handleChange = e => {
		const { name, value } = e.target
		const newFormData = { ...formData, [name]: value }
		setFormData(newFormData)

		// активируем фон, если поле корректно заполнено
		setIsActive(prev => ({
			...prev,
			[name]: value.trim().length > 1,
		}))

		// Перевалидация при изменениях после первой отправки
		if (isSubmitted) validateForm(newFormData)
	}

	const handleBlur = e => {
		const { name, value } = e.target
		setIsActive(prev => ({
			...prev,
			[name]: value.trim().length > 1,
		}))
	}

	// Формируем плейсхолдеры
	const loginPlaceholder = 'Эл. почта*'
	const passwordPlaceholder = 'Пароль*'
	const namePlaceholder = 'Имя*'

	const handleSubmit = async e => {
		e.preventDefault()
		setIsSubmitted(true)
		if (!validateForm()) return

		setLoading(true)
		try {
			const data = !isSignUp
				? await signIn({ login: formData.login, password: formData.password })
				: await signUp(formData)

			if (data) {
				updateUserInfo(data)
				navigate('/')
			}
		} catch (err) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	const isFormValid =
		(isSignUp ? formData.name.trim() : true) &&
		formData.login.trim() &&
		formData.password.trim()

	return (
		<div className={styles.auth__container}>
			<div className={styles.auth__modal}>
				<div className={styles.auth__wrapper}>
					<h2 className={styles.auth__title}>
						{isSignUp ? 'Регистрация' : 'Вход'}
					</h2>
					<form className={styles.auth__form} onSubmit={handleSubmit}>
						<div className={styles.auth__input_wrapper}>
							{isSignUp && (
								<input
									type='text'
									name='name'
									placeholder={namePlaceholder}
									value={formData.name}
									onChange={handleChange}
									onBlur={handleBlur}
									className={[
										styles.auth__input,
										errors.name ? styles.auth__input_error : '',
									].join(' ')}
									style={
										isActive.name && !errors.name
											? {
													background: ACTIVE_BG_COLOR,
													border: `1.5px solid ${ACTIVE_BORDER_COLOR}`,
												}
											: {}
									}
								/>
							)}
							<input
								type='text'
								name='login'
								placeholder={loginPlaceholder}
								value={formData.login}
								onChange={handleChange}
								onBlur={handleBlur}
								className={[
									styles.auth__input,
									errors.login ? styles.auth__input_error : '',
								].join(' ')}
								style={
									isActive.login && !errors.login
										? {
												background: ACTIVE_BG_COLOR,
												border: `1.5px solid ${ACTIVE_BORDER_COLOR}`,
											}
										: {}
								}
							/>
							<input
								type='password'
								name='password'
								placeholder={passwordPlaceholder}
								value={formData.password}
								onChange={handleChange}
								onBlur={handleBlur}
								className={[
									styles.auth__input,
									errors.password ? styles.auth__input_error : '',
								].join(' ')}
								style={
									isActive.password && !errors.password
										? {
												background: ACTIVE_BG_COLOR,
												border: `1.5px solid ${ACTIVE_BORDER_COLOR}`,
											}
										: {}
								}
							/>
						</div>
						{/* Ошибка только при невалидности после попытки отправки */}
						{isSubmitted && error && (
							<p className={styles.auth__error_text}>{error}</p>
						)}
						<button
							className={styles.auth__button}
							type='submit'
							disabled={!!error || loading}
						>
							{isSignUp ? 'Зарегистрироваться' : 'Войти'}
						</button>
						{!isSignUp && (
							<div className={styles.auth__group}>
								<p className={styles.auth__text}>Нужно зарегистрироваться?</p>
								<Link className={styles.auth__link} to='/sign-up'>
									Регистрируйтесь здесь
								</Link>
							</div>
						)}
						{isSignUp && (
							<div className={styles.auth__group}>
								<p className={styles.auth__text}>
									Есть аккаунт?{' '}
									<Link className={styles.auth__link} to='/sign-in'>
										Войдите здесь
									</Link>
								</p>
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	)
}

export default AuthForm
