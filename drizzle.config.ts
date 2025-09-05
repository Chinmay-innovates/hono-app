import { defineConfig } from 'drizzle-kit';
import { env } from './server/lib/env';

export default defineConfig({
  out: './server/db/migrations',
  schema: './server/lib/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
