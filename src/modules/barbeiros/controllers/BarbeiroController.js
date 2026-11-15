import { asyncHandler } from '../../../shared/asyncHandler.js'
import { BarbeiroRepository } from '../repositories/BarbeiroRepository.js'
import { CreateBarbeiroUseCase, DeleteBarbeiroUseCase, ListBarbeirosUseCase, UpdateBarbeiroUseCase } from '../useCases/BarbeiroUseCases.js'

const repository = new BarbeiroRepository()
const listUseCase = new ListBarbeirosUseCase(repository)
const createUseCase = new CreateBarbeiroUseCase(repository)
const updateUseCase = new UpdateBarbeiroUseCase(repository)
const deleteUseCase = new DeleteBarbeiroUseCase(repository)

export const listBarbeiros = asyncHandler(async (_request, response) => response.json(await listUseCase.execute()))
export const createBarbeiro = asyncHandler(async (request, response) => response.status(201).json(await createUseCase.execute(request.body)))
export const updateBarbeiro = asyncHandler(async (request, response) => response.json(await updateUseCase.execute(request.params.id, request.body)))
export const deleteBarbeiro = asyncHandler(async (request, response) => { await deleteUseCase.execute(request.params.id); response.status(204).end() })
