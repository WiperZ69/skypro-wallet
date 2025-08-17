import { createContext, useContext, useState } from 'react'

const MobileScreenContext = createContext()

export const MobileScreenProvider = ({ children }) => {
	const [mobileScreen, setMobileScreen] = useState('list')

	return (
		<MobileScreenContext.Provider value={{ mobileScreen, setMobileScreen }}>
			{children}
		</MobileScreenContext.Provider>
	)
}

export const useMobileScreen = () => {
	const context = useContext(MobileScreenContext)
	if (!context) {
		throw new Error(
			'useMobileScreen must be used within a MobileScreenProvider'
		)
	}
	return context
}
