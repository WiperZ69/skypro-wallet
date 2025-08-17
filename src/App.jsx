import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './assets/styles/globals.scss'
import { Header } from './components/layout/Header/Header'
import AuthProvider from './provider/AuthProvider'
import { ExpenseProvider } from './provider/ExpenseProvider'
import {
	MobileScreenProvider,
	useMobileScreen,
} from './provider/MobileScreenProvider'
import AppRoutes from './routes/AppRoutes'

const RouteChangeHandler = () => {
	const { setMobileScreen } = useMobileScreen()
	const location = useLocation()

	useEffect(() => {
		if (location.pathname !== '/') {
			setMobileScreen('list')
		}
	}, [location.pathname, setMobileScreen])

	return null
}

function App() {
	return (
		<div>
			<AuthProvider>
				<ExpenseProvider>
					<MobileScreenProvider>
						<Header />
						<RouteChangeHandler />
						<AppRoutes />
					</MobileScreenProvider>
				</ExpenseProvider>
			</AuthProvider>
		</div>
	)
}

export default App
