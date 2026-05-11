import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/GetAllCategories': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/SaveCategory': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/DeleteCategory': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/GetAllSubjects': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/createSubject': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/DeleteSubject': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/AllTestSeries': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/AllTestPapers': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  }
})