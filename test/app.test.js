import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import request from 'supertest'

const query = jest.fn()
jest.unstable_mockModule('../src/config/database.js', () => ({ query, pool: { end: jest.fn() } }))

const { app } = await import('../src/app.js')
const user = { id: 'user-1', nome: 'André Silva', email: 'admin@barberflow.com' }

describe('API', () => {
  beforeEach(() => {
    query.mockReset()
    global.fetch = jest.fn()
  })

  it('realiza login e cria sessão', async () => {
    query.mockResolvedValueOnce({ rows: [user] }).mockResolvedValueOnce({ rows: [{ token: 'token-1', expira_em: '2026-11-13' }] })
    const response = await request(app).post('/api/auth/login').send({ email: 'ADMIN@barberflow.com', password: '123456' })
    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({ token: 'token-1', user })
  })

  it('rejeita credenciais inválidas e acesso sem token', async () => {
    query.mockResolvedValueOnce({ rows: [] })
    const login = await request(app).post('/api/auth/login').send({ email: 'x@x.com', password: 'errada' })
    const clients = await request(app).get('/api/clientes')
    expect(login.status).toBe(401)
    expect(clients.status).toBe(401)
  })

  it.each([
    ['/api/clientes', [{ id: 'c1', nome: 'Ana' }], 'Ana'],
    ['/api/barbeiros', [{ id: 'b1', nome: 'Bia' }], 'Bia'],
    ['/api/servicos', [{ id: 's1', descricao: 'Corte' }], 'Corte'],
    ['/api/agendamentos', [{ id: 'a1', cliente: 'Ana' }], 'Ana'],
  ])('lista recursos protegidos em %s', async (path, rows, expected) => {
    query.mockResolvedValueOnce({ rows: [user] }).mockResolvedValueOnce({ rows })
    const response = await request(app).get(path).set('Authorization', 'Bearer token-1')
    expect(response.status).toBe(200)
    expect(JSON.stringify(response.body)).toContain(expected)
  })

  it('consulta um CEP pelo backend', async () => {
    query.mockResolvedValueOnce({ rows: [user] })
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP' }) })
    const response = await request(app).get('/api/cep/01001000').set('Authorization', 'Bearer token-1')
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ cidade: 'São Paulo', estado: 'SP' })
  })

  it.each([
    ['/api/clientes', { nome: 'Caio', telefone: '3', email: 'c@c.com', cep: '01001-000' }],
    ['/api/barbeiros', { nome: 'Dani', especialidade: 'Barba', telefone: '4' }],
    ['/api/servicos', { descricao: 'Barba', valor: 25, duracao: 20 }],
    ['/api/agendamentos', { clienteId: 'c1', barbeiroId: 'b1', servicoId: 's1', data: '2026-11-13', hora: '11:00' }],
  ])('cria recursos protegidos em %s', async (path, body) => {
    query.mockResolvedValueOnce({ rows: [user] }).mockResolvedValueOnce({ rows: [{ id: 'created' }] })
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP' }) })
    const response = await request(app).post(path).set('Authorization', 'Bearer token-1').send(body)
    expect(response.status).toBe(201)
  })

  it.each([
    ['/api/clientes/c1', { nome: 'Caio', telefone: '3', email: 'c@c.com', cep: '01001-000' }],
    ['/api/barbeiros/b1', { nome: 'Dani', especialidade: 'Barba', telefone: '4' }],
    ['/api/servicos/s1', { descricao: 'Barba', valor: 25, duracao: 20 }],
    ['/api/agendamentos/a1', { clienteId: 'c1', barbeiroId: 'b1', servicoId: 's1', data: '2026-11-13', hora: '11:00', status: 'confirmado' }],
  ])('edita recursos protegidos em %s', async (path, body) => {
    query.mockResolvedValueOnce({ rows: [user] }).mockResolvedValueOnce({ rows: [{ id: 'updated' }] })
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ cep: '01001-000', logradouro: 'Praça da Sé', bairro: 'Sé', localidade: 'São Paulo', uf: 'SP' }) })
    const response = await request(app).put(path).set('Authorization', 'Bearer token-1').send(body)
    expect(response.status).toBe(200)
  })

  it.each(['/api/clientes/c1', '/api/barbeiros/b1', '/api/servicos/s1', '/api/agendamentos/a1'])('exclui recursos protegidos em %s', async (path) => {
    query.mockResolvedValueOnce({ rows: [user] }).mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'deleted' }] })
    const response = await request(app).delete(path).set('Authorization', 'Bearer token-1')
    expect(response.status).toBe(204)
  })

  it('impede exclusão de registro com agendamentos vinculados', async () => {
    const conflict = Object.assign(new Error('foreign key'), { code: '23503' })
    query.mockResolvedValueOnce({ rows: [user] }).mockRejectedValueOnce(conflict)
    const response = await request(app).delete('/api/clientes/c1').set('Authorization', 'Bearer token-1')
    expect(response.status).toBe(409)
    expect(response.body.error).toContain('agendamentos vinculados')
  })

  it('retorna indicadores completos do dashboard', async () => {
    query
      .mockResolvedValueOnce({ rows: [user] })
      .mockResolvedValueOnce({ rows: [{ appointments: 8, revenue: '450', average_ticket: '56.25', clients: 12, development_clients: 3, top_service: 'Corte', peak_hour: '10:00' }] })
      .mockResolvedValueOnce({ rows: [{ month: '2026-11', appointments: 8, revenue: '450' }] })
      .mockResolvedValueOnce({ rows: [{ name: 'Corte', total: 4, revenue: '180' }] })
      .mockResolvedValueOnce({ rows: [{ status: 'concluido', total: 5 }] })
      .mockResolvedValueOnce({ rows: [{ hour: '10:00', total: 3 }] })
      .mockResolvedValueOnce({ rows: [{ date: '2026-11-01', total: 2 }] })
      .mockResolvedValueOnce({ rows: [{ id: 'c1', name: 'Ana', last_visit: null }] })
    const response = await request(app).get('/api/dashboard?month=2026-11').set('Authorization', 'Bearer token-1')
    expect(response.status).toBe(200)
    expect(response.body.metrics).toMatchObject({ revenue: 450, averageTicket: 56.25, developmentClients: 3 })
    expect(response.body.services[0]).toMatchObject({ name: 'Corte', total: 4 })
  })

  it('encerra sessão', async () => {
    query.mockResolvedValueOnce({ rows: [user] }).mockResolvedValueOnce({ rows: [] })
    const response = await request(app).delete('/api/auth/session').set('Authorization', 'Bearer token-1')
    expect(response.status).toBe(204)
  })
})
