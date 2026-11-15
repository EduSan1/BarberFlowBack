import { HttpError } from '../../../shared/httpError.js'

export class UpdateClienteUseCase {
  constructor(repository, viaCepService) { this.repository = repository; this.viaCepService = viaCepService }
  async execute(id, input) {
    const { nome, telefone, email, cep } = input
    if (!nome || !telefone || !email || !cep) throw new HttpError(400, 'Nome, telefone, e-mail e CEP são obrigatórios.')
    const address = await this.viaCepService.lookup(cep)
    const updated = await this.repository.update(id, { nome: nome.trim(), telefone: telefone.trim(), email: email.trim().toLowerCase(), ...address })
    if (!updated) throw new HttpError(404, 'Cliente não encontrado.')
    return updated
  }
}

export class DeleteClienteUseCase {
  constructor(repository) { this.repository = repository }
  async execute(id) {
    if (!await this.repository.delete(id)) throw new HttpError(404, 'Cliente não encontrado.')
  }
}
