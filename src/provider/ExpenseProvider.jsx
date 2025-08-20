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

	const fetchExpenses = async () => {
		try {
			setLoading(true)
			setError('')
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
			setError('')
			const { data } = await axios.post(WALLET_API_URL, expense, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
					'Content-Type': '',
				},
			})
			setExpenses(data)
			return data
		} catch (error) {
			const errorMessage = error.response?.data?.error || error.message
			setError(errorMessage)
			console.error('Ошибка добавления транзакции:', errorMessage)
			throw error
		}
	}

	const deleteExpense = async id => {
		try {
			setError('')
			await axios.delete(`${WALLET_API_URL}/${id}`, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			})
			setExpenses(prev => prev.filter(expense => expense._id !== id))
		} catch (error) {
			const errorMessage = error.response?.data?.error || error.message
			setError(errorMessage)
			console.error('Ошибка при удалении транзакции:', errorMessage)
			throw error
		}
	}

	return (
		<ExpenseContext.Provider
			value={{
				expenses,
				addExpense,
				deleteExpense,
				loading,
			}}
		>
			{children}
		</ExpenseContext.Provider>
	)
}
