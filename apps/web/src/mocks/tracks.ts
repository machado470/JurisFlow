export type Track = {
  id: string
  name: string
  description: string
  conformity: number
  risk: 'success' | 'warning' | 'danger'
}

export const tracks: Track[] = [
  {
    id: 'contracts',
    name: 'Contratos',
    description:
      'Boas práticas na elaboração, revisão e gestão de contratos.',
    conformity: 62,
    risk: 'warning',
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description:
      'Normas internas, ética corporativa e prevenção de riscos.',
    conformity: 48,
    risk: 'danger',
  },
  {
    id: 'ip',
    name: 'Propriedade Intelectual',
    description:
      'Gestão de marcas, patentes e ativos intelectuais.',
    conformity: 91,
    risk: 'success',
  },
  {
    id: 'civil',
    name: 'Responsabilidade Civil',
    description:
      'Riscos contratuais, extracontratuais e indenizações.',
    conformity: 75,
    risk: 'success',
  },
  {
    id: 'labor',
    name: 'Trabalhista',
    description:
      'Relações de trabalho, compliance trabalhista e passivos.',
    conformity: 58,
    risk: 'warning',
  },
]
