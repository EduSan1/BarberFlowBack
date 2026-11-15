import { HttpError } from '../../../shared/httpError.js'
export class ListBarbeirosUseCase { constructor(repository) { this.repository = repository } execute() { return this.repository.findAll() } }
export class CreateBarbeiroUseCase {
  constructor(repository) { this.repository = repository }
  execute(input) { if (!input.nome || !input.especialidade || !input.telefone) throw new HttpError(400, 'Nome, especialidade e telefone são obrigatórios.'); return this.repository.create({ nome: input.nome.trim(), especialidade: input.especialidade.trim(), telefone: input.telefone.trim() }) }
}
