import { Route, Routes } from 'react-router-dom'
import { ExpensesPage } from '../pages/ExpensesPage'
import { LogOutPage } from '../pages/LogOutPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import SignInPage from '../pages/SignInPage'
import SignUpPage from '../pages/SignUpPage'
import SpendingPage from '../pages/SpendingPage'
import PrivateRoute from './PrivateRoute'

function AppRoutes() {
	return (
		<Routes>
			<Route element={<PrivateRoute />}>
				<Route path='/' element={<ExpensesPage />} />
				<Route path='/spending' element={<SpendingPage />} />
				<Route path='/logout' element={<LogOutPage />} />
			</Route>
			<Route path='/sign-in' element={<SignInPage />} />
			<Route path='/sign-up' element={<SignUpPage />} />
			<Route path='*' element={<NotFoundPage />} />
		</Routes>
	)
}

export default AppRoutes
