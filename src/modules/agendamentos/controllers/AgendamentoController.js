import { asyncHandler } from '../../../shared/asyncHandler.js'
import { AgendamentoRepository } from '../repositories/AgendamentoRepository.js'
import { CreateAgendamentoUseCase, DeleteAgendamentoUseCase, ListAgendamentosUseCase, UpdateAgendamentoUseCase } from '../useCases/AgendamentoUseCases.js'

const repository = new AgendamentoRepository()
const listUseCase = new ListAgendamentosUseCase(repository)
const createUseCase = new CreateAgendamentoUseCase(repository)
const updateUseCase = new UpdateAgendamentoUseCase(repository)
const deleteUseCase = new DeleteAgendamentoUseCase(repository)

export const listAgendamentos = asyncHandler(async (_request, response) => response.json(await listUseCase.execute()))
export const createAgendamento = asyncHandler(async (request, response) => response.status(201).json(await createUseCase.execute(request.body)))
export const updateAgendamento = asyncHandler(async (request, response) => response.json(await updateUseCase.execute(request.params.id, request.body)))
export const deleteAgendamento = asyncHandler(async (request, response) => { await deleteUseCase.execute(request.params.id); response.status(204).end() })
