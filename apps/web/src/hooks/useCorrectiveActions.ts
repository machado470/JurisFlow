import { useCallback, useEffect, useState } from 'react'
import {
  createCorrectiveAction,
  getCorrectiveActionsByPerson,
  resolveCorrectiveAction,
} from '../services/correctiveActions'

import type {
  CorrectiveAction,
} from '../services/correctiveActions'

export function useCorrectiveActions(personId?: string) {
  const [actions, setActions] = useState<CorrectiveAction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!personId) return
    setLoading(true)
    setError(null)

    try {
      const data = await getCorrectiveActionsByPerson(personId)
      setActions(data)
    } catch {
      setError('Falha ao carregar ações corretivas')
      setActions([])
    } finally {
      setLoading(false)
    }
  }, [personId])

  const create = useCallback(
    async (reason: string) => {
      if (!personId) return
      setLoading(true)
      setError(null)
      setSuccess(null)

      try {
        await createCorrectiveAction(personId, reason)
        setSuccess('Ação corretiva registrada com sucesso')
        await load()
      } catch {
        setError('Falha ao criar ação corretiva')
      } finally {
        setLoading(false)
      }
    },
    [personId, load],
  )

  const resolve = useCallback(
    async (id: string) => {
      setLoading(true)
      setError(null)
      setSuccess(null)

      try {
        await resolveCorrectiveAction(id)
        setSuccess('Ação corretiva resolvida com sucesso')
        await load()
      } catch {
        setError('Falha ao resolver ação corretiva')
      } finally {
        setLoading(false)
      }
    },
    [load],
  )

  useEffect(() => {
    load()
  }, [load])

  return {
    actions,
    loading,
    error,
    success,
    reload: load,
    create,
    resolve,
  }
}

