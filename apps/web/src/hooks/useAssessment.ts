import { useState } from 'react'
import { submitAssessment } from '../services/assessments'

export function useAssessment() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function submit(params: {
    assignmentId: string
    score: number
    notes?: string
  }) {
    try {
      setLoading(true)
      setSuccess(false)
      await submitAssessment(params)
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
