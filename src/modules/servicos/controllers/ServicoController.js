import { asyncHandler } from '../../../shared/asyncHandler.js'
import { ServicoRepository } from '../repositories/ServicoRepository.js'
import { CreateServicoUseCase, DeleteServicoUseCase, ListServicosUseCase, UpdateServicoUseCase } from '../useCases/ServicoUseCases.js'

const repository = new ServicoRepository()
const listUseCase = new ListServicosUseCase(repository)
const createUseCase = new CreateServicoUseCase(repository)
const updateUseCase = new UpdateServicoUseCase(repository)
const deleteUseCase = new DeleteServicoUseCase(repository)

export const listServicos = asyncHandler(async (_request, response) => response.json(await listUseCase.execute()))
export const createServico = asyncHandler(async (request, response) => response.status(201).json(await createUseCase.execute(request.body)))
export const updateServico = asyncHandler(async (request, response) => response.json(await updateUseCase.execute(request.params.id, request.body)))
export const deleteServico = asyncHandler(async (request, response) => { await deleteUseCase.execute(request.params.id); response.status(204).end() })
