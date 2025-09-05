import { z } from 'zod'

const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().default('SUPER_SECRET_KEY'),
  BETTER_AUTH_URL: z.string(),
  CLIENT_URL: z.string(),
})

export const env = EnvSchema.parse(process.env)

export type Env = z.infer<typeof EnvSchema>
