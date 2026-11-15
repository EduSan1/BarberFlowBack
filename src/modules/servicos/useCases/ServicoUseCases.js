import { HttpError } from '../../../shared/httpError.js'

export class ListServicosUseCase {
  constructor(repository) { this.repository = repository }
  execute() { return this.repository.findAll() }
}

export class CreateServicoUseCase {
  constructor(repository) { this.repository = repository }
  execute(input) {
    const valor = Number(input.valor)
    const duracao = Number(input.duracao)
    if (!input.descricao || !Number.isFinite(valor) || valor < 0 || !Number.isInteger(duracao) || duracao <= 0) throw new HttpError(400, 'Descrição, valor e duração válidos são obrigatórios.')
    return this.repository.create({ descricao: input.descricao.trim(), valor, duracao })
  }
}
