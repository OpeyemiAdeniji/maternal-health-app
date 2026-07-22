import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'all',
      '.ngrok-free.app',
      'fa9c-2a02-8086-d45-af00-74e7-d1b4-e4b6-b947.ngrok-free.app'
    ],
  },
})
