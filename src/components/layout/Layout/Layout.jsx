import { Header } from '../Header/Header'
import styles from './Layout.module.scss'

export const Layout = ({ mobileScreen, setMobileScreen, children }) => {
	return (
		<>
			<Header mobileScreen={mobileScreen} setMobileScreen={setMobileScreen} />
			<main className={styles.layout}>{children}</main>
		</>
	)
}
