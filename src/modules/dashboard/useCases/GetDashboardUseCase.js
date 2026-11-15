import { HttpError } from '../../../shared/httpError.js'

export class GetDashboardUseCase {
  constructor(repository) { this.repository = repository }
  execute(month) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month || '')) throw new HttpError(400, 'Mês inválido. Use o formato AAAA-MM.')
    return this.repository.getAnalytics(month)
  }
}
