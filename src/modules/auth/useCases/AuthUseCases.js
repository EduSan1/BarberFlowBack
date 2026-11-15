import { HttpError } from '../../../shared/httpError.js'

export class LoginUseCase {
  constructor(repository) { this.repository = repository }
  async execute(input) {
    if (!input.email || !input.password) throw new HttpError(400, 'E-mail e senha são obrigatórios.')
    const user = await this.repository.authenticate(input.email.trim().toLowerCase(), input.password)
    if (!user) throw new HttpError(401, 'E-mail ou senha inválidos.')
    const session = await this.repository.createSession(user.id)
    return { token: session.token, expiresAt: session.expira_em, user }
  }
}

export class GetSessionUseCase {
  constructor(repository) { this.repository = repository }
  async execute(token) {
    const user = await this.repository.findSession(token)
    if (!user) throw new HttpError(401, 'Sessão inválida ou expirada.')
    return user
  }
}

export class LogoutUseCase {
  constructor(repository) { this.repository = repository }
  execute(token) { return this.repository.deleteSession(token) }
}
