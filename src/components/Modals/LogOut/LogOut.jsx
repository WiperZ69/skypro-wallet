import { useNavigate } from 'react-router-dom'
import Modal from '../Modal'
import styles from './LogOut.module.scss'

export const LogOut = ({ updateUserInfo, onClose }) => {
	const navigate = useNavigate()

	function handleLogout(e) {
		e.preventDefault()
		updateUserInfo(null)
		onClose()
		navigate('/sign-in')
	}
	function cancelLogout(e) {
		e.preventDefault()
		onClose()
		navigate('/')
	}

	return (
		<Modal>
			<div className={styles.overlay}>
				<div className={styles.container}>
					<p className={styles.text}>Выйти из аккаунта?</p>
					<div className={styles.block}>
						<button className={styles.btn} onClick={handleLogout}>
							Да, выйти
						</button>
						<button className={styles.btn} onClick={cancelLogout}>
							Нет, остаться
						</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}
