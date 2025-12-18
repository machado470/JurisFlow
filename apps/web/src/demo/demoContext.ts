export const DEMO_MODE = true

export const DEMO_DATA = {
  kpis: {
    totalPeople: 12,
    peopleAtRiskCount: 2,
    activeTracks: 5,
    complianceRate: 83,
  },

  peopleAtRisk: [
    {
      id: 'demo-1',
      name: 'Adv. João Silva',
      role: 'Associado',
      riskScore: 78,
      reason: 'Trilha obrigatória não concluída',
    },
    {
      id: 'demo-2',
      name: 'Adv. Maria Costa',
      role: 'Júnior',
      riskScore: 65,
      reason: 'Avaliação vencida',
    },
  ],
}
