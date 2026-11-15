import express from 'express'
import cors from 'cors'
import { query } from './config/database.js'
import { listClientes, createCliente, deleteCliente, lookupCep, updateCliente } from './modules/clientes/controllers/ClienteController.js'
import { listBarbeiros, createBarbeiro, deleteBarbeiro, updateBarbeiro } from './modules/barbeiros/controllers/BarbeiroController.js'
import { listServicos, createServico, deleteServico, updateServico } from './modules/servicos/controllers/ServicoController.js'
import { listAgendamentos, createAgendamento, deleteAgendamento, updateAgendamento } from './modules/agendamentos/controllers/AgendamentoController.js'
import { login, logout, me } from './modules/auth/controllers/AuthController.js'
import { authenticate } from './modules/auth/middlewares/authenticate.js'
import { getDashboard } from './modules/dashboard/controllers/DashboardController.js'

export const app = express()
app.use(cors())
app.use(express.json())
app.get('/health', async (_request, response) => { await query('SELECT 1'); response.json({ status: 'ok', database: 'connected' }) })
app.post('/api/auth/login', login)
app.use('/api', authenticate)
app.get('/api/auth/me', me)
app.delete('/api/auth/session', logout)
app.get('/api/clientes', listClientes)
app.post('/api/clientes', createCliente)
app.put('/api/clientes/:id', updateCliente)
app.delete('/api/clientes/:id', deleteCliente)
app.get('/api/cep/:cep', lookupCep)
app.get('/api/barbeiros', listBarbeiros)
app.post('/api/barbeiros', createBarbeiro)
app.put('/api/barbeiros/:id', updateBarbeiro)
app.delete('/api/barbeiros/:id', deleteBarbeiro)
app.get('/api/servicos', listServicos)
app.post('/api/servicos', createServico)
app.put('/api/servicos/:id', updateServico)
app.delete('/api/servicos/:id', deleteServico)
app.get('/api/agendamentos', listAgendamentos)
app.post('/api/agendamentos', createAgendamento)
app.put('/api/agendamentos/:id', updateAgendamento)
app.delete('/api/agendamentos/:id', deleteAgendamento)
app.get('/api/dashboard', getDashboard)
app.use((error, _request, response, _next) => {
  if (error.code === '23505') return response.status(409).json({ error: 'Este barbeiro já possui atendimento nesse horário.' })
  if (error.code === '23503') return response.status(409).json({ error: 'Este registro possui agendamentos vinculados. Exclua os agendamentos relacionados primeiro.' })
  if (!error.status || error.status >= 500) console.error(error)
  response.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor.' })
})
