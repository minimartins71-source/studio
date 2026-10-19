import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// En local, fait tourner les fichiers de /api comme le fera Vercel en ligne.
function apiDevServer(): Plugin {
  return {
    name: 'studio-api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const match = url.pathname.match(/^\/api\/([a-z-]+)$/)
        if (!match) return next()
        try {
          const mod = await server.ssrLoadModule(`/api/${match[1]}.ts`)
          const handler = mod[req.method ?? 'GET']
          if (typeof handler !== 'function') {
            res.statusCode = 405
            return res.end()
          }
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value)
          }
          const response: Response = await handler(
            new Request(url, {
              method: req.method,
              headers,
              body: chunks.length ? Buffer.concat(chunks) : undefined,
            }),
          )
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charge .env.local pour le serveur uniquement. Seules les variables
  // qui commencent par VITE_ sont envoyées au navigateur.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) process.env[key] ??= value

  return {
    plugins: [
      // Le plugin TanStack Router doit être placé avant le plugin React
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
      apiDevServer(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
  }
})
