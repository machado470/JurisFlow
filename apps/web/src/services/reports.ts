import api from './api'

/**
 * Relatório executivo consolidado
 * Retorna pessoas em risco e indicadores gerais
 */
export async function getExecutiveReport(orgId: string) {
  const res = await api.get('/reports/executive')
  return res.data.data
}

/**
 * Pendências operacionais
 */
export async function listPendings() {
  const res = await api.get('/reports/pending')
  return res.data.data
}
