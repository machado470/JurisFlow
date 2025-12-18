export function generateCorrectiveAction(personId: string) {
  return {
    assignmentId: `assign-${Date.now()}`,
    personId,
    createdAt: new Date().toISOString(),
    reason: 'Ação gerada automaticamente por risco elevado',
    auditEvent: {
      type: 'CORRECTIVE_ACTION_CREATED',
      timestamp: new Date().toISOString(),
    },
  }
}
