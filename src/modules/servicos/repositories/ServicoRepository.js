import { query } from '../../../config/database.js'
export class ServicoRepository {
  async findAll() { const result = await query('SELECT id, descricao, valor, duracao FROM servicos ORDER BY descricao'); return result.rows }
  async create(data) { const result = await query('INSERT INTO servicos (descricao, valor, duracao) VALUES ($1, $2, $3) RETURNING *', [data.descricao, data.valor, data.duracao]); return result.rows[0] }
  async update(id, data) { const result = await query('UPDATE servicos SET descricao = $2, valor = $3, duracao = $4 WHERE id = $1 RETURNING *', [id, data.descricao, data.valor, data.duracao]); return result.rows[0] }
  async delete(id) { const result = await query('DELETE FROM servicos WHERE id = $1 RETURNING id', [id]); return result.rowCount > 0 }
}
