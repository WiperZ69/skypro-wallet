import js from '@eslint/js'
import configPrettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,jsx}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
			ecmaFeatures: {
				jsx: true,
			},
		},
		plugins: {
			react: pluginReact,
			prettier: pluginPrettier,
		},
		rules: {
			'prettier/prettier': [
				'error',
				{
					semi: false,
					useTabs: true,
					singleQuote: true,
					jsxSingleQuote: true,
					arrowParens: 'avoid',
				},
			],

			'react/react-in-jsx-scope': 'off',
			'react/prop-types': 'off',
		},
		extends: [
			js.configs.recommended,
			...pluginReact.configs.flat.recommended,
			configPrettier,
		],
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
])
