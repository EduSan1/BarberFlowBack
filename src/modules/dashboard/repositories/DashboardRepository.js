import { query } from '../../../config/database.js'

export class DashboardRepository {
  async getAnalytics(month) {
    const params = [`${month}-01`]
    const [summary, trend, services, statuses, hours, days, development] = await Promise.all([
      query(`SELECT
        (SELECT COUNT(*)::int FROM agendamentos WHERE data >= $1::date AND data < $1::date + INTERVAL '1 month') AS appointments,
        (SELECT COALESCE(SUM(s.valor), 0)::numeric FROM agendamentos a JOIN servicos s ON s.id = a.servico_id WHERE a.status = 'concluido' AND a.data >= $1::date AND a.data < $1::date + INTERVAL '1 month') AS revenue,
        (SELECT COALESCE(AVG(s.valor), 0)::numeric FROM agendamentos a JOIN servicos s ON s.id = a.servico_id WHERE a.status = 'concluido' AND a.data >= $1::date AND a.data < $1::date + INTERVAL '1 month') AS average_ticket,
        (SELECT COUNT(*)::int FROM clientes) AS clients,
        (SELECT COUNT(*)::int FROM clientes c WHERE NOT EXISTS (SELECT 1 FROM agendamentos a WHERE a.cliente_id = c.id AND a.status = 'concluido' AND a.data >= CURRENT_DATE - INTERVAL '90 days')) AS development_clients,
        (SELECT s.descricao FROM agendamentos a JOIN servicos s ON s.id = a.servico_id WHERE a.status <> 'cancelado' AND a.data >= $1::date AND a.data < $1::date + INTERVAL '1 month' GROUP BY s.id, s.descricao ORDER BY COUNT(*) DESC, s.descricao LIMIT 1) AS top_service,
        (SELECT TO_CHAR(a.hora, 'HH24:MI') FROM agendamentos a WHERE a.status <> 'cancelado' AND a.data >= $1::date AND a.data < $1::date + INTERVAL '1 month' GROUP BY a.hora ORDER BY COUNT(*) DESC, a.hora LIMIT 1) AS peak_hour`, params),
      query(`SELECT TO_CHAR(months.month, 'YYYY-MM') AS month, COUNT(a.id)::int AS appointments, COALESCE(SUM(s.valor) FILTER (WHERE a.status = 'concluido'), 0)::numeric AS revenue FROM generate_series(date_trunc('month', $1::date) - INTERVAL '5 months', date_trunc('month', $1::date), INTERVAL '1 month') months(month) LEFT JOIN agendamentos a ON a.data >= months.month AND a.data < months.month + INTERVAL '1 month' LEFT JOIN servicos s ON s.id = a.servico_id GROUP BY months.month ORDER BY months.month`, params),
      query(`SELECT s.descricao AS name, COUNT(a.id)::int AS total, COALESCE(SUM(s.valor) FILTER (WHERE a.status = 'concluido'), 0)::numeric AS revenue FROM servicos s LEFT JOIN agendamentos a ON a.servico_id = s.id AND a.status <> 'cancelado' AND a.data >= $1::date AND a.data < $1::date + INTERVAL '1 month' GROUP BY s.id, s.descricao ORDER BY total DESC, s.descricao LIMIT 5`, params),
      query(`SELECT status, COUNT(*)::int AS total FROM agendamentos WHERE data >= $1::date AND data < $1::date + INTERVAL '1 month' GROUP BY status ORDER BY total DESC`, params),
      query(`SELECT TO_CHAR(hora, 'HH24:MI') AS hour, COUNT(*)::int AS total FROM agendamentos WHERE status <> 'cancelado' AND data >= $1::date AND data < $1::date + INTERVAL '1 month' GROUP BY hora ORDER BY total DESC, hora LIMIT 5`, params),
      query(`SELECT TO_CHAR(days.day, 'YYYY-MM-DD') AS date, COUNT(a.id)::int AS total FROM generate_series($1::date, $1::date + INTERVAL '1 month' - INTERVAL '1 day', INTERVAL '1 day') days(day) LEFT JOIN agendamentos a ON a.data = days.day GROUP BY days.day ORDER BY days.day`, params),
      query(`SELECT c.id, c.nome AS name, MAX(a.data) FILTER (WHERE a.status = 'concluido') AS last_visit FROM clientes c LEFT JOIN agendamentos a ON a.cliente_id = c.id GROUP BY c.id, c.nome HAVING MAX(a.data) FILTER (WHERE a.status = 'concluido') IS NULL OR MAX(a.data) FILTER (WHERE a.status = 'concluido') < CURRENT_DATE - INTERVAL '90 days' ORDER BY last_visit NULLS FIRST, c.nome LIMIT 5`),
    ])
    const totals = summary.rows[0]
    return {
      month,
      metrics: {
        appointments: Number(totals.appointments),
        revenue: Number(totals.revenue),
        averageTicket: Number(totals.average_ticket),
        clients: Number(totals.clients),
        developmentClients: Number(totals.development_clients),
        topService: totals.top_service || 'Sem dados',
        peakHour: totals.peak_hour || 'Sem dados',
      },
      trend: trend.rows.map((item) => ({ ...item, appointments: Number(item.appointments), revenue: Number(item.revenue) })),
      services: services.rows.map((item) => ({ ...item, total: Number(item.total), revenue: Number(item.revenue) })),
      statuses: statuses.rows.map((item) => ({ ...item, total: Number(item.total) })),
      hours: hours.rows.map((item) => ({ ...item, total: Number(item.total) })),
      days: days.rows.map((item) => ({ date: String(item.date).slice(0, 10), total: Number(item.total) })),
      developmentClients: development.rows,
    }
  }
}
