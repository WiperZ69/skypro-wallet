import styles from './ErrorMessage.module.scss'

export const ErrorMessage = ({ message }) => {
	if (!message) return null

	return <div className={styles.error}>{message}</div>
}
