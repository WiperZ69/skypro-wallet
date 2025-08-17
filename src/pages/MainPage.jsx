import { Layout } from '../components/layout/Layout/Layout'
import { ExpensesPage } from './ExpensesPage'
import SpendingPage from './SpendingPage'
export const MainPage = () => {
	return (
		<Layout>
			<ExpensesPage />
			<SpendingPage />
		</Layout>
	)
}
