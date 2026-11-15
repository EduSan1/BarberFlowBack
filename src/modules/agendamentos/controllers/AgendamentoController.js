import { asyncHandler } from '../../../shared/asyncHandler.js'
import { AgendamentoRepository } from '../repositories/AgendamentoRepository.js'
import { CreateAgendamentoUseCase, ListAgendamentosUseCase } from '../useCases/AgendamentoUseCases.js'
const repository = new AgendamentoRepository()
const listUseCase = new ListAgendamentosUseCase(repository)
const createUseCase = new CreateAgendamentoUseCase(repository)
export const listAgendamentos = asyncHandler(async (_request, response) => response.json(await listUseCase.execute()))
export const createAgendamento = asyncHandler(async (request, response) => response.status(201).json(await createUseCase.execute(request.body)))
