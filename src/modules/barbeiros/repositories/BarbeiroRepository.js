import { query } from '../../../config/database.js'
export class BarbeiroRepository {
  async findAll() { const result = await query('SELECT id, nome, especialidade, telefone FROM barbeiros ORDER BY nome'); return result.rows }
  async create(data) { const result = await query('INSERT INTO barbeiros (nome, especialidade, telefone) VALUES ($1, $2, $3) RETURNING *', [data.nome, data.especialidade, data.telefone]); return result.rows[0] }
}
