import { asyncHandler } from '../../../shared/asyncHandler.js'
import { ServicoRepository } from '../repositories/ServicoRepository.js'
import { CreateServicoUseCase, ListServicosUseCase } from '../useCases/ServicoUseCases.js'
const repository = new ServicoRepository()
const listUseCase = new ListServicosUseCase(repository)
const createUseCase = new CreateServicoUseCase(repository)
export const listServicos = asyncHandler(async (_request, response) => response.json(await listUseCase.execute()))
export const createServico = asyncHandler(async (request, response) => response.status(201).json(await createUseCase.execute(request.body)))
