export function seedDemo(orgKey: string) {
  // PEOPLE
  const people = [
    {
      id: 'p-admin',
      orgKey,
      name: 'Dra. Ana Sócia',
      email: 'ana@demo.com',
      role: 'ADMIN',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p-gestor',
      orgKey,
      name: 'Dr. Bruno Gestor',
      email: 'bruno@demo.com',
      role: 'GESTOR',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p-colab',
      orgKey,
      name: 'Carla Associada',
      email: 'carla@demo.com',
      role: 'COLABORADOR',
      active: true,
      createdAt: new Date().toISOString()
    }
  ]

  localStorage.setItem('jurisflow_people', JSON.stringify(people))

  // TRACKS
  const tracks = [
    {
      id: 't-completa',
      title: 'LGPD e Proteção de Dados',
      description: 'Treinamento obrigatório de LGPD'
    },
    {
      id: 't-incompleta',
      title: 'Procedimentos Processuais Internos',
      description: 'Padronização de rotinas internas'
    }
  ]

  localStorage.setItem('jurisflow_tracks', JSON.stringify(tracks))

  // PROGRESS
  const progress = {
    't-completa': 100,
    't-incompleta': 40
  }

  localStorage.setItem(
    'jurisflow_progress',
    JSON.stringify({ [orgKey]: progress })
  )

  // ASSIGNMENTS
  const assignments = [
    {
      id: 'a-1',
      orgKey,
      personId: 'p-colab',
      trackId: 't-incompleta',
      mandatory: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'a-2',
      orgKey,
      personId: 'p-colab',
      trackId: 't-completa',
      mandatory: true,
      createdAt: new Date().toISOString()
    }
  ]

  localStorage.setItem(
    'jurisflow_assignments',
    JSON.stringify(assignments)
  )

  alert('Demo carregada com sucesso')
}
