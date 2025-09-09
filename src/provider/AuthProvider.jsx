import { createContext, useState } from 'react'
import { checkLs } from '../utils/checkLs'

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(checkLs())

	const updateUserInfo = userData => {
		setUser(userData)
		if (userData) {
			localStorage.setItem('userInfo', JSON.stringify(userData))
		} else {
			localStorage.removeItem('userInfo')
		}
	}

	return (
		<AuthContext.Provider value={{ user, updateUserInfo }}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthProvider
