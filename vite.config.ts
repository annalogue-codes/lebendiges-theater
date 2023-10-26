import { defineConfig } from "vite";
// import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
	plugins: [
		// basicSsl(),
	],
	base: "/theater/",
	server: { host: "localhost", port: 8000 },
	clearScreen: false,
});
