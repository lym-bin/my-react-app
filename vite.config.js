// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // JSX 변환 + 빠른 리로드 담당 플러그인
import tailwindcss from "@tailwindcss/vite"; // Tailwind 처리 플러그인

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
});
