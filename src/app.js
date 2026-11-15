import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { query } from './config/database.js'
import { listClientes, createCliente, lookupCep } from './modules/clientes/controllers/ClienteController.js'
import { listBarbeiros, createBarbeiro } from './modules/barbeiros/controllers/BarbeiroController.js'
import { listServicos, createServico } from './modules/servicos/controllers/ServicoController.js'
import { listAgendamentos, createAgendamento } from './modules/agendamentos/controllers/AgendamentoController.js'
import { login, logout, me } from './modules/auth/controllers/AuthController.js'
import { authenticate } from './modules/auth/middlewares/authenticate.js'
import { getDashboard } from './modules/dashboard/controllers/DashboardController.js'

export const app = express()
app.use(cors({ origin: env.allowedOrigins }))
app.use(express.json())
app.get('/health', async (_request, response) => { await query('SELECT 1'); response.json({ status: 'ok', database: 'connected' }) })
app.post('/api/auth/login', login)
app.use('/api', authenticate)
app.get('/api/auth/me', me)
app.delete('/api/auth/session', logout)
app.get('/api/clientes', listClientes)
app.post('/api/clientes', createCliente)
app.get('/api/cep/:cep', lookupCep)
app.get('/api/barbeiros', listBarbeiros)
app.post('/api/barbeiros', createBarbeiro)
app.get('/api/servicos', listServicos)
app.post('/api/servicos', createServico)
app.get('/api/agendamentos', listAgendamentos)
app.post('/api/agendamentos', createAgendamento)
app.get('/api/dashboard', getDashboard)
app.use((error, _request, response, _next) => {
  if (!error.status || error.status >= 500) console.error(error)
  if (error.code === '23505') return response.status(409).json({ error: 'Este barbeiro já possui atendimento nesse horário.' })
  response.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor.' })
})
