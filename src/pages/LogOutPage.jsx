import { LogOut } from 'lucide-react'
import { useContext } from 'react'
import { AuthContext } from '../provider/AuthProvider'

export const LogOutPage = () => {
	const { updateUserInfo } = useContext(AuthContext)
	return <LogOut updateUserInfo={updateUserInfo} />
}
