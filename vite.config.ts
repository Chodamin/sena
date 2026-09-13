import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    /** 예: https://chodamin.github.io/sena/ → VITE_BASE_PATH=/sena/ */
    base: env.VITE_BASE_PATH?.trim() || '/',
  }
})
