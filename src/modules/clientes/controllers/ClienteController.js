import { asyncHandler } from '../../../shared/asyncHandler.js'
import { ClienteRepository } from '../repositories/ClienteRepository.js'
import { CreateClienteUseCase } from '../useCases/CreateClienteUseCase.js'
import { ListClientesUseCase } from '../useCases/ListClientesUseCase.js'
import { ViaCepService } from '../services/ViaCepService.js'
import { DeleteClienteUseCase, UpdateClienteUseCase } from '../useCases/ManageClienteUseCases.js'

const repository = new ClienteRepository()
const viaCepService = new ViaCepService()
const listUseCase = new ListClientesUseCase(repository)
const createUseCase = new CreateClienteUseCase(repository, viaCepService)
const updateUseCase = new UpdateClienteUseCase(repository, viaCepService)
const deleteUseCase = new DeleteClienteUseCase(repository)

export const listClientes = asyncHandler(async (_request, response) => response.json(await listUseCase.execute()))
export const createCliente = asyncHandler(async (request, response) => response.status(201).json(await createUseCase.execute(request.body)))
export const updateCliente = asyncHandler(async (request, response) => response.json(await updateUseCase.execute(request.params.id, request.body)))
export const deleteCliente = asyncHandler(async (request, response) => { await deleteUseCase.execute(request.params.id); response.status(204).end() })
export const lookupCep = asyncHandler(async (request, response) => response.json(await viaCepService.lookup(request.params.cep)))
