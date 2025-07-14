const { heroui } = require('@heroui/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
		'./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'hero-background': "url('/images/hero-cover-1.webp')",
				'hero-background-2': "url('/images/hero-cover-2.webp')",
				'hero-background-3': "url('/images/hero-cover-3.webp')",
			},
		},
		layout: {
			disabledOpacity: '0.4',
		},
	},
	darkMode: 'class',
	plugins: [heroui()],
};
