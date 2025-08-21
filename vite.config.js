import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace <REPO_NAME> with your repo, e.g., 'runners-meal-plan'
export default defineConfig({
  plugins: [react()],
  base: '/runners-meal-plan/',
})