import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../provider/AuthProvider'

function PrivateRoute() {
	const { user } = useContext(AuthContext)
	return user ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute
