import axios from 'axios'
import { USER_API_URL } from './apiConfig'

export async function signIn(userData) {
	try {
		const response = await axios.post(`${USER_API_URL}/login`, userData, {
			headers: {
				'Content-Type': '',
			},
		})
		const user = response.data.user
		const token = user.token

		localStorage.setItem('token', token)
		return { user, token }
	} catch (error) {
		throw new Error(error.response?.data?.error || 'Ошибка входа')
	}
}

export async function signUp(userData) {
	try {
		const response = await axios.post(USER_API_URL, userData, {
			headers: {
				'Content-Type': '',
			},
		})
		const user = response.data.user
		const token = user.token

		localStorage.setItem('token', token)
		return { user, token }
	} catch (error) {
		console.log(error)
		throw new Error(error.response?.data?.error || 'Ошибка регистрации')
	}
}

export function getToken() {
	return localStorage.getItem('token')
}
