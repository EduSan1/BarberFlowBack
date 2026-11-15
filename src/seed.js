import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { query, pool } from './config/database.js'

const seed = await readFile(fileURLToPath(new URL('../db/seed.sql', import.meta.url)), 'utf8')
try {
  await query(seed)
  console.log('Dados de demonstração carregados com sucesso.')
} finally {
  await pool.end()
}
