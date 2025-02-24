import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/cartonBoxAdmin/", // Set the base URL
  plugins: [react()],
});
