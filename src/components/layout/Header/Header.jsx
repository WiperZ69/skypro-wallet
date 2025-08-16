import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../../provider/AuthProvider'
import { LogOut } from '../../Modals/LogOut/LogOut'
import styles from './Header.module.scss'

export const Header = () => {
	const { updateUserInfo } = useContext(AuthContext)
	const [isLogoutOpen, setIsLogoutOpen] = useState(false)
	return (
		<header className={styles.header}>
			<div className={styles.header__container}>
				<Link className={styles.header__logo} to='/'>
					<img className={styles.header__image} src='/logo.svg' alt='logo' />
				</Link>
				<div className={styles.header__links}>
					<Link to='/'>Мои расходы</Link>
					<Link to='/spending'>Анализ расходов</Link>
				</div>

				<button
					className={styles.header__btn}
					onClick={() => setIsLogoutOpen(true)}
				>
					Выйти
				</button>
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
