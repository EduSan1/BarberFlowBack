import { asyncHandler } from '../../../shared/asyncHandler.js'
import { HttpError } from '../../../shared/httpError.js'
import { authServices, readBearerToken } from '../auth.js'

export const authenticate = asyncHandler(async (request, _response, next) => {
  const token = readBearerToken(request.headers.authorization)
  if (!token) throw new HttpError(401, 'Autenticação necessária.')
  request.auth = { token, user: await authServices.getSession.execute(token) }
  next()
})
