const { nextui } = require("@nextui-org/react");
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
	content: [
		"./src/**/*.{html,js}",
		"./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@material-tailwind/dist/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@material-tailwind/dist/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				cardback: "#18181B",
			},
		},
	},
	darkMode: "class",
	plugins: [nextui()],
});
