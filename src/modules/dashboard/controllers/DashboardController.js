import { asyncHandler } from '../../../shared/asyncHandler.js'
import { DashboardRepository } from '../repositories/DashboardRepository.js'
import { GetDashboardUseCase } from '../useCases/GetDashboardUseCase.js'

const useCase = new GetDashboardUseCase(new DashboardRepository())

export const getDashboard = asyncHandler(async (request, response) => {
  const currentMonth = new Date().toISOString().slice(0, 7)
  response.json(await useCase.execute(request.query.month || currentMonth))
})
