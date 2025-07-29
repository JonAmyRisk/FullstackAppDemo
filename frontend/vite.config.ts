import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [react()],
    define: {
      // At build-time, Vite will replace __BASE_URL__ with the actual string
      __BASE_URL__: JSON.stringify(env.VITE_BASE_URL),
    },
  }
})