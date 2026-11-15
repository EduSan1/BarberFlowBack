import { HttpError } from '../../../shared/httpError.js'

export class CreateClienteUseCase {
  constructor(repository, viaCepService) { this.repository = repository; this.viaCepService = viaCepService }
  async execute(input) {
    const { nome, telefone, email, cep } = input
    if (!nome || !telefone || !email || !cep) throw new HttpError(400, 'Nome, telefone, e-mail e CEP são obrigatórios.')
    const address = await this.viaCepService.lookup(cep)
    return this.repository.create({ nome: nome.trim(), telefone: telefone.trim(), email: email.trim().toLowerCase(), ...address })
  }
}
