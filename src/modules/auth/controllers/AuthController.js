import { asyncHandler } from '../../../shared/asyncHandler.js'
import { authServices } from '../auth.js'

export const login = asyncHandler(async (request, response) => response.status(201).json(await authServices.login.execute(request.body)))
export const me = asyncHandler(async (request, response) => response.json(request.auth.user))
export const logout = asyncHandler(async (request, response) => {
  await authServices.logout.execute(request.auth.token)
  response.status(204).end()
})
