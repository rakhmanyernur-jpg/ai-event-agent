import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()], server: {
    allowedHosts: true, // ✅ разрешить всем
    host: true,         // чтобы сервер был доступен извне (например через ngrok)
    port: 5173,         // можно указать свой порт
  },
})
