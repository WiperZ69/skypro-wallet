import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [react()],
	css: {
		modules: {
			localsConvention: 'camelCase',
		},
		preprocessorOptions: {
			scss: {
				additionalData: `@use "/src/assets/styles/variables.scss" as *;`,
			},
		},
	},
})
