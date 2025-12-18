import { useState } from 'react'
import api from '../services/api'

export function useAssessment() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function submit(params: {
    assignmentId: string
    score: number
    notes?: string
  }) {
    setLoading(true)
    setSuccess(false)

    try {
      await api.post('/assessments', params)
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  return {
    submit,
    loading,
    success,
  }
}
