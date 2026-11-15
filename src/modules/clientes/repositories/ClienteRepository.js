import { query } from '../../../config/database.js'

export class ClienteRepository {
  async findAll() {
    const result = await query('SELECT id, nome, telefone, email, cep, logradouro, bairro, cidade, estado, criado_em FROM clientes ORDER BY nome')
    return result.rows
  }

  async create(data) {
    const result = await query('INSERT INTO clientes (nome, telefone, email, cep, logradouro, bairro, cidade, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [data.nome, data.telefone, data.email, data.cep, data.logradouro, data.bairro, data.cidade, data.estado])
    return result.rows[0]
  }

  async update(id, data) {
    const result = await query('UPDATE clientes SET nome = $2, telefone = $3, email = $4, cep = $5, logradouro = $6, bairro = $7, cidade = $8, estado = $9 WHERE id = $1 RETURNING *', [id, data.nome, data.telefone, data.email, data.cep, data.logradouro, data.bairro, data.cidade, data.estado])
    return result.rows[0]
  }

  async delete(id) {
    const result = await query('DELETE FROM clientes WHERE id = $1 RETURNING id', [id])
    return result.rowCount > 0
  }
}
