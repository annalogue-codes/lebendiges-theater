import { defineConfig } from "vite";
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
	plugins: [
		basicSsl(),
	],
	base: "./",
	server: {
		// host: "localhost",
		host: true,
		port: 8000
	},
	preview: {
		port: 8001
	},
	clearScreen: false,
	build: {
		target: 'ES2022',
	},
});
