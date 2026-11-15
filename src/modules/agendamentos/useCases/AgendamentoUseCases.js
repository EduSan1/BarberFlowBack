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
export class UpdateAgendamentoUseCase {
  constructor(repository) { this.repository = repository }
  async execute(id, input) {
    if (!input.clienteId || !input.barbeiroId || !input.servicoId || !input.data || !input.hora) throw new HttpError(400, 'Cliente, barbeiro, serviço, data e hora são obrigatórios.')
    if (!['agendado', 'confirmado', 'concluido', 'cancelado'].includes(input.status)) throw new HttpError(400, 'Status inválido.')
    const updated = await this.repository.update(id, input)
    if (!updated) throw new HttpError(404, 'Agendamento não encontrado.')
    return updated
  }
}
export class DeleteAgendamentoUseCase {
  constructor(repository) { this.repository = repository }
  async execute(id) { if (!await this.repository.delete(id)) throw new HttpError(404, 'Agendamento não encontrado.') }
}
