import { HttpError } from '../../../shared/httpError.js'
export class ListAgendamentosUseCase { constructor(repository) { this.repository = repository } execute() { return this.repository.findAll() } }
export class CreateAgendamentoUseCase {
  constructor(repository) { this.repository = repository }
  execute(input) {
    if (!input.clienteId || !input.barbeiroId || !input.servicoId || !input.data || !input.hora) throw new HttpError(400, 'Cliente, barbeiro, serviço, data e hora são obrigatórios.')
    const status = input.status || 'agendado'
    if (!['agendado', 'confirmado', 'concluido', 'cancelado'].includes(status)) throw new HttpError(400, 'Status inválido.')
    return this.repository.create({ ...input, status })
  }
}
