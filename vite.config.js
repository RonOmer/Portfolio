import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const repositoryName =
    process.env.GITHUB_REPOSITORY?.split('/')[1] || 'Portfolio'

  return {
    plugins: [react()],
    base: mode === 'github-pages' ? `/${repositoryName}/` : '/',
  }
})
