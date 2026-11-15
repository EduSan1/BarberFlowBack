import { HttpError } from '../../../shared/httpError.js'
export class ListBarbeirosUseCase { constructor(repository) { this.repository = repository } execute() { return this.repository.findAll() } }
export class CreateBarbeiroUseCase {
  constructor(repository) { this.repository = repository }
  execute(input) { if (!input.nome || !input.especialidade || !input.telefone) throw new HttpError(400, 'Nome, especialidade e telefone são obrigatórios.'); return this.repository.create({ nome: input.nome.trim(), especialidade: input.especialidade.trim(), telefone: input.telefone.trim() }) }
}
export class UpdateBarbeiroUseCase {
  constructor(repository) { this.repository = repository }
  async execute(id, input) {
    if (!input.nome || !input.especialidade || !input.telefone) throw new HttpError(400, 'Nome, especialidade e telefone são obrigatórios.')
    const updated = await this.repository.update(id, { nome: input.nome.trim(), especialidade: input.especialidade.trim(), telefone: input.telefone.trim() })
    if (!updated) throw new HttpError(404, 'Barbeiro não encontrado.')
    return updated
  }
}
export class DeleteBarbeiroUseCase {
  constructor(repository) { this.repository = repository }
  async execute(id) { if (!await this.repository.delete(id)) throw new HttpError(404, 'Barbeiro não encontrado.') }
}
