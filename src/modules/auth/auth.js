import { AuthRepository } from './repositories/AuthRepository.js'
import { GetSessionUseCase, LoginUseCase, LogoutUseCase } from './useCases/AuthUseCases.js'

const repository = new AuthRepository()

export const authServices = {
  login: new LoginUseCase(repository),
  getSession: new GetSessionUseCase(repository),
  logout: new LogoutUseCase(repository),
}

export function readBearerToken(authorization = '') {
  const [scheme, token] = authorization.split(' ')
  return scheme === 'Bearer' && token ? token : null
}
