import api from './api'

/**
 * ============================
 * TIPOS DE DOMÍNIO (FRONT)
 * ============================
 */

export type PersonRole = 'ADMIN' | 'COLLABORATOR'

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type PersonSummary = {
  id: string
  name: string
  email: string
  role: PersonRole
  active: boolean
  risk?: RiskLevel
  progress?: number
}

export type PersonDetail = PersonSummary & {
  orgId: string
  createdAt: string
}

export type PersonAssignment = {
  id: string
  trackId: string
  trackTitle: string
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE'
  score?: number
  updatedAt: string
}

/**
 * ============================
 * NORMALIZAÇÃO
 * ============================
 */

function unwrap<T>(res: any): T {
  // garante isolamento do formato do backend
  return res?.data?.data ?? res?.data ?? res
}

/**
 * ============================
 * SERVICES
 * ============================
 */

export async function listPeople(): Promise<PersonSummary[]> {
  const res = await api.get('/persons')
  const data = unwrap<any[]>(res)

  return data.map(p => ({
    id: p.id,
    name: p.name,
    email: p.email,
    role: p.role,
    active: p.active,
    risk: p.risk ?? null,
    progress: p.progress ?? null,
  }))
}

export async function getPersonById(
  id: string,
): Promise<PersonDetail> {
  const res = await api.get(`/persons/${id}`)
  const p = unwrap<any>(res)

  return {
    id: p.id,
    name: p.name,
    email: p.email,
    role: p.role,
    active: p.active,
    orgId: p.orgId,
    createdAt: p.createdAt,
    risk: p.risk ?? null,
    progress: p.progress ?? null,
  }
}

export async function getPersonAssignments(
  id: string,
): Promise<PersonAssignment[]> {
  const res = await api.get(`/persons/${id}/assignments`)
  const data = unwrap<any[]>(res)

  return data.map(a => ({
    id: a.id,
    trackId: a.trackId,
    trackTitle: a.track?.title ?? 'Trilha',
    status: a.status,
    score: a.score ?? null,
    updatedAt: a.updatedAt,
  }))
}

export async function setPersonActive(
  id: string,
  active: boolean,
) {
  await api.patch(`/persons/${id}/active`, { active })
}

