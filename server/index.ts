import { Hono } from 'hono'
import { logger } from 'hono/logger'

import { auth } from './lib/auth'
import { getTodos } from './lib/queries'

const app = new Hono().basePath('/api')
app.use(logger())

const router = app
app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw))
.get('/todos', async (c) => {
  try {
    const todos = await getTodos()
    return c.json(todos)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Failed to fetch todos' }, 500)
  }
})
.get('/people', (c) => {
  return c.json([
    { id: 1, name: 'Alice' },
    {id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ])
})

export type AppType = typeof router

export default app
