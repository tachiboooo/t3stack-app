import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  schema: './db/*',
  out: '.db/drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
