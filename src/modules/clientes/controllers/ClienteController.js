import { asyncHandler } from '../../../shared/asyncHandler.js'
import { ClienteRepository } from '../repositories/ClienteRepository.js'
import { CreateClienteUseCase } from '../useCases/CreateClienteUseCase.js'
import { ListClientesUseCase } from '../useCases/ListClientesUseCase.js'
import { ViaCepService } from '../services/ViaCepService.js'

const repository = new ClienteRepository()
const viaCepService = new ViaCepService()
const listUseCase = new ListClientesUseCase(repository)
const createUseCase = new CreateClienteUseCase(repository, viaCepService)

export const listClientes = asyncHandler(async (_request, response) => response.json(await listUseCase.execute()))
export const createCliente = asyncHandler(async (request, response) => response.status(201).json(await createUseCase.execute(request.body)))
export const lookupCep = asyncHandler(async (request, response) => response.json(await viaCepService.lookup(request.params.cep)))
