import { query } from '../../../config/database.js'
export class AgendamentoRepository {
  async findAll() {
    const result = await query(`SELECT a.id, a.cliente_id, a.barbeiro_id, a.servico_id, a.data, a.hora, a.status, c.nome AS cliente, b.nome AS barbeiro, s.descricao AS servico FROM agendamentos a JOIN clientes c ON c.id = a.cliente_id JOIN barbeiros b ON b.id = a.barbeiro_id JOIN servicos s ON s.id = a.servico_id ORDER BY a.data, a.hora`)
    return result.rows
  }
  async create(data) {
    const result = await query('INSERT INTO agendamentos (cliente_id, barbeiro_id, servico_id, data, hora, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [data.clienteId, data.barbeiroId, data.servicoId, data.data, data.hora, data.status])
    return result.rows[0]
  }
  async update(id, data) {
    const result = await query('UPDATE agendamentos SET cliente_id = $2, barbeiro_id = $3, servico_id = $4, data = $5, hora = $6, status = $7 WHERE id = $1 RETURNING *', [id, data.clienteId, data.barbeiroId, data.servicoId, data.data, data.hora, data.status])
    return result.rows[0]
  }
  async delete(id) { const result = await query('DELETE FROM agendamentos WHERE id = $1 RETURNING id', [id]); return result.rowCount > 0 }
}
