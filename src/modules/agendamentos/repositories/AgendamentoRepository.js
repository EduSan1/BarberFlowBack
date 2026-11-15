import { query } from '../../../config/database.js'
export class AgendamentoRepository {
  async findAll() {
    const result = await query(`SELECT a.id, a.data, a.hora, a.status, c.nome AS cliente, b.nome AS barbeiro, s.descricao AS servico FROM agendamentos a JOIN clientes c ON c.id = a.cliente_id JOIN barbeiros b ON b.id = a.barbeiro_id JOIN servicos s ON s.id = a.servico_id ORDER BY a.data, a.hora`)
    return result.rows
  }
  async create(data) {
    const result = await query('INSERT INTO agendamentos (cliente_id, barbeiro_id, servico_id, data, hora, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [data.clienteId, data.barbeiroId, data.servicoId, data.data, data.hora, data.status])
    return result.rows[0]
  }
}
