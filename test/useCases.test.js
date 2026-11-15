import { describe, expect, it, jest } from '@jest/globals'
import { CreateClienteUseCase } from '../src/modules/clientes/useCases/CreateClienteUseCase.js'
import { CreateBarbeiroUseCase } from '../src/modules/barbeiros/useCases/BarbeiroUseCases.js'
import { CreateServicoUseCase } from '../src/modules/servicos/useCases/ServicoUseCases.js'
import { CreateAgendamentoUseCase } from '../src/modules/agendamentos/useCases/AgendamentoUseCases.js'
import { GetSessionUseCase, LoginUseCase } from '../src/modules/auth/useCases/AuthUseCases.js'
import { GetDashboardUseCase } from '../src/modules/dashboard/useCases/GetDashboardUseCase.js'
import { ViaCepService } from '../src/modules/clientes/services/ViaCepService.js'
import { readBearerToken } from '../src/modules/auth/auth.js'

const repository = () => ({ create: jest.fn((data) => data), authenticate: jest.fn(), createSession: jest.fn(), findSession: jest.fn(), getAnalytics: jest.fn() })

describe('casos de uso', () => {
  it('normaliza cliente e incorpora endereço do ViaCEP', async () => {
    const repo = repository()
    const viaCep = { lookup: jest.fn().mockResolvedValue({ cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', cidade: 'São Paulo', estado: 'SP' }) }
    await new CreateClienteUseCase(repo, viaCep).execute({ nome: ' Ana ', telefone: ' 1 ', email: ' A@A.COM ', cep: '01001000' })
    expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Ana', email: 'a@a.com', cidade: 'São Paulo', estado: 'SP' }))
  })

  it.each([
    [CreateBarbeiroUseCase, {}],
    [CreateServicoUseCase, { descricao: 'Corte', valor: -1, duracao: 0 }],
    [CreateAgendamentoUseCase, {}],
    [CreateAgendamentoUseCase, { clienteId: '1', barbeiroId: '2', servicoId: '3', data: '2026-11-12', hora: '10:00', status: 'outro' }],
  ])('valida dados em %s', (UseCase, input) => {
    expect(() => new UseCase(repository(), {}).execute(input)).toThrow()
  })

  it('valida os dados obrigatórios do cliente', async () => {
    await expect(new CreateClienteUseCase(repository(), {}).execute({})).rejects.toThrow('CEP são obrigatórios')
  })

  it('valida login e sessão', async () => {
    const repo = repository()
    repo.authenticate.mockResolvedValue({ id: 'u1', nome: 'Ana' })
    repo.createSession.mockResolvedValue({ token: 't1', expira_em: 'amanhã' })
    repo.findSession.mockResolvedValue({ id: 'u1' })
    await expect(new LoginUseCase(repo).execute({ email: ' A@A.COM ', password: '123' })).resolves.toMatchObject({ token: 't1' })
    await expect(new GetSessionUseCase(repo).execute('t1')).resolves.toEqual({ id: 'u1' })
    expect(readBearerToken('Bearer t1')).toBe('t1')
    expect(readBearerToken('Basic t1')).toBeNull()
  })

  it('valida o período do dashboard', () => {
    const repo = repository()
    new GetDashboardUseCase(repo).execute('2026-11')
    expect(repo.getAnalytics).toHaveBeenCalledWith('2026-11')
    expect(() => new GetDashboardUseCase(repo).execute('11/2026')).toThrow('Mês inválido')
  })

  it('consulta e normaliza o ViaCEP', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP' }) })
    await expect(new ViaCepService().lookup('01001000')).resolves.toMatchObject({ cidade: 'São Paulo', estado: 'SP' })
    await expect(new ViaCepService().lookup('123')).rejects.toThrow('CEP inválido')
  })
})
