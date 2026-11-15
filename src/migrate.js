import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import pg from 'pg'
import { env } from './config/env.js'
const client = new pg.Client({ connectionString: env.databaseUrl, ssl: { rejectUnauthorized: false } })
const schema = await readFile(fileURLToPath(new URL('../db/schema.sql', import.meta.url)), 'utf8')
try { await client.connect(); await client.query(schema); console.log('Schema do BarberFlow aplicado com sucesso.') } finally { await client.end() }
