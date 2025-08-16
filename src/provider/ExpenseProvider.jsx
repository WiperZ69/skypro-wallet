import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'
import { WALLET_API_URL } from '../services/Apiconfig'
import { getToken } from '../services/auth'
import { AuthContext } from './AuthProvider'

export const ExpenseContext = createContext({
	expenses: [],
	loading: false,
	error: '',
})

export const ExpenseProvider = ({ children }) => {
	const [expenses, setExpenses] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const { user } = useContext(AuthContext)
	const [editingExpense, setEditingExpense] = useState(null)
	const clearEditingExpense = () => setEditingExpense(null)

	const fetchExpenses = async () => {
		try {
			setLoading(true)
			const { data } = await axios.get(WALLET_API_URL, {
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			setExpenses(data)
		} catch (error) {
			setError(error.response?.data?.error || error.message)
			console.error('Ошибка загрузки карточек:', error.message)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => {
		if (!user?.token) return

		fetchExpenses()
	}, [user?.token])

	const addExpense = async expense => {
		try {
			await axios.post(WALLET_API_URL, expense, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
					'Content-Type': '',
				},
			})
			await fetchExpenses()
		} catch (error) {
			console.error('Ошибка добавления транзакции:', error.message)
		}
	}

	const deleteExpense = async id => {
		try {
			await axios.delete(`${WALLET_API_URL}/${id}`, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			})
			await fetchExpenses()
		} catch (error) {
			console.error('Ошибка при удалении транзакции:', error.message)
		}
	}

	return (
		<ExpenseContext.Provider
			value={{
				expenses,
				addExpense,
				deleteExpense,
				editingExpense,
				setEditingExpense,
				clearEditingExpense,
				loading,
			}}
		>
			{children}
		</ExpenseContext.Provider>
	)
}
