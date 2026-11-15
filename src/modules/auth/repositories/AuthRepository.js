import { query } from '../../../config/database.js'

export class AuthRepository {
  async authenticate(email, password) {
    const result = await query('SELECT id, nome, email FROM usuarios WHERE email = $1 AND senha_hash = crypt($2, senha_hash)', [email, password])
    return result.rows[0]
  }

  async createSession(userId) {
    const result = await query('INSERT INTO sessoes (usuario_id) VALUES ($1) RETURNING token, expira_em', [userId])
    return result.rows[0]
  }

  async findSession(token) {
    const result = await query('SELECT u.id, u.nome, u.email FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id WHERE s.token = $1 AND s.expira_em > NOW()', [token])
    return result.rows[0]
  }

  async deleteSession(token) {
    await query('DELETE FROM sessoes WHERE token = $1', [token])
  }
}
