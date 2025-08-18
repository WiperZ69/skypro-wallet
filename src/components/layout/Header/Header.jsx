import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../../provider/AuthProvider'
import { useMobileScreen } from '../../../provider/MobileScreenProvider'
import { LogOut } from '../../Modals/LogOut/LogOut'
import styles from './Header.module.scss'

export const Header = () => {
	const { updateUserInfo, user } = useContext(AuthContext) // Предполагается, что user доступен
	const { mobileScreen, setMobileScreen } = useMobileScreen()
	const [isLogoutOpen, setIsLogoutOpen] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuRef = useRef(null)
	const btnRef = useRef(null)
	const location = useLocation()
	const navigate = useNavigate()

	// Проверяем, находится ли пользователь на странице авторизации
	const isAuthPage =
		location.pathname === '/sign-in' || location.pathname === '/sign-up'

	// Текущее название страницы для кнопки (для мобильного меню)
	const currentTitle = isAuthPage
		? 'Авторизация'
		: location.pathname.startsWith('/spending')
			? 'Анализ расходов'
			: mobileScreen === 'list'
				? 'Мои расходы'
				: 'Новый расход'

	// Закрытие по клику снаружи
	useEffect(() => {
		const onDocClick = e => {
			if (!isMenuOpen) return
			const target = e.target
			if (menuRef.current && menuRef.current.contains(target)) return
			if (btnRef.current && btnRef.current.contains(target)) return
			setIsMenuOpen(false)
		}
		document.addEventListener('mousedown', onDocClick)
		return () => document.removeEventListener('mousedown', onDocClick)
	}, [isMenuOpen])

	// Закрытие по ESC
	useEffect(() => {
		const onEsc = e => e.key === 'Escape' && setIsMenuOpen(false)
		document.addEventListener('keydown', onEsc)
		return () => document.removeEventListener('keydown', onEsc)
	}, [])

	// Закрывать меню при смене маршрута
	useEffect(() => {
		setIsMenuOpen(false)
	}, [location.pathname])

	const go = path => {
		if (location.pathname !== path) navigate(path)
	}

	return (
		<header className={styles.header}>
			<div className={styles.header__container}>
				<Link className={styles.header__logo} to='/'>
					<img className={styles.header__image} src='/logo.svg' alt='logo' />
				</Link>

				{/* ДЕСКТОП: показываем ссылки только для авторизованных пользователей */}
				{!isAuthPage && user && (
					<div className={styles.header__links}>
						<Link
							className={`${
								location.pathname === '/' ? styles['is-active'] : ''
							}`}
							to='/'
						>
							Мои расходы
						</Link>
						<Link
							className={`${
								location.pathname === '/spending' ? styles['is-active'] : ''
							}`}
							to='/spending'
						>
							Анализ расходов
						</Link>
					</div>
				)}

				{/* МОБИЛЬНЫЙ переключатель */}
				<div className={styles.header__switch}>
					<button
						ref={btnRef}
						type='button'
						className={styles.switch__btn}
						aria-haspopup='listbox'
						aria-expanded={isMenuOpen}
						onClick={() => setIsMenuOpen(v => !v)}
					>
						{currentTitle}
					</button>
					<span className={styles.switch__caret} aria-hidden='true'>
						▾
					</span>
					{!isAuthPage && user && (
						<button
							className={styles.header__exit}
							onClick={() => setIsLogoutOpen(true)}
						>
							Выйти
						</button>
					)}

					{isMenuOpen && (
						<div className={styles.switch__menu} ref={menuRef}>
							{!isAuthPage && user && (
								<>
									<button
										className={`${styles.switch__item} ${
											location.pathname === '/' && mobileScreen === 'list'
												? styles['is-active']
												: ''
										}`}
										role='option'
										aria-current={
											location.pathname === '/' && mobileScreen === 'list'
												? 'page'
												: undefined
										}
										onClick={() => {
											go('/')
											setMobileScreen('list')
											setIsMenuOpen(false)
										}}
									>
										Мои расходы
									</button>
									<button
										className={`${styles.switch__item} ${
											location.pathname === '/' && mobileScreen === 'new'
												? styles['is-active']
												: ''
										}`}
										role='option'
										aria-current={
											location.pathname === '/' && mobileScreen === 'new'
												? 'page'
												: undefined
										}
										onClick={() => {
											go('/')
											setMobileScreen('new')
											setIsMenuOpen(false)
										}}
									>
										Новый расход
									</button>
									<button
										className={`${styles.switch__item} ${
											location.pathname.startsWith('/spending')
												? styles['is-active']
												: ''
										}`}
										role='option'
										aria-current={
											location.pathname.startsWith('/spending')
												? 'page'
												: undefined
										}
										onClick={() => {
											go('/spending')
											setMobileScreen('list')
											setIsMenuOpen(false)
										}}
									>
										Анализ расходов
									</button>
								</>
							)}
							{isAuthPage && (
								<>
									<button
										className={`${styles.switch__item} ${
											location.pathname === '/sign-in'
												? styles['is-active']
												: ''
										}`}
										role='option'
										aria-current={
											location.pathname === '/sign-in' ? 'page' : undefined
										}
										onClick={() => {
											go('/sign-in')
											setIsMenuOpen(false)
										}}
									>
										Вход
									</button>
									<button
										className={`${styles.switch__item} ${
											location.pathname === '/sign-up'
												? styles['is-active']
												: ''
										}`}
										role='option'
										aria-current={
											location.pathname === '/sign-up' ? 'page' : undefined
										}
										onClick={() => {
											go('/sign-up')
											setIsMenuOpen(false)
										}}
									>
										Регистрация
									</button>
								</>
							)}
						</div>
					)}
				</div>

				{/* ДЕСКТОП: кнопка "Выйти" только для авторизованных пользователей */}
				{!isAuthPage && user && (
					<button
						className={styles.header__btn}
						onClick={() => setIsLogoutOpen(true)}
					>
						Выйти
					</button>
				)}
			</div>

			{isLogoutOpen && (
				<LogOut
					updateUserInfo={updateUserInfo}
					onClose={() => setIsLogoutOpen(false)}
				/>
			)}
		</header>
	)
}
