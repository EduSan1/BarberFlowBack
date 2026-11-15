import { asyncHandler } from '../../../shared/asyncHandler.js'
import { BarbeiroRepository } from '../repositories/BarbeiroRepository.js'
import { CreateBarbeiroUseCase, ListBarbeirosUseCase } from '../useCases/BarbeiroUseCases.js'
const repository = new BarbeiroRepository()
const listUseCase = new ListBarbeirosUseCase(repository)
const createUseCase = new CreateBarbeiroUseCase(repository)
export const listBarbeiros = asyncHandler(async (_request, response) => response.json(await listUseCase.execute()))
export const createBarbeiro = asyncHandler(async (request, response) => response.status(201).json(await createUseCase.execute(request.body)))
