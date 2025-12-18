import { PrismaClient, RiskLevel } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // limpa tudo (demo limpa)
  await prisma.auditEvent.deleteMany()
  await prisma.assessment.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.track.deleteMany()
  await prisma.person.deleteMany()

  // pessoas
  const ana = await prisma.person.create({
    data: {
      name: 'Ana Souza',
      email: 'ana@demo.com',
      role: 'ADVOGADA',
    },
  })

  const bruno = await prisma.person.create({
    data: {
      name: 'Bruno Lima',
      email: 'bruno@demo.com',
      role: 'ADVOGADO',
    },
  })

  const carla = await prisma.person.create({
    data: {
      name: 'Carla Mendes',
      email: 'carla@demo.com',
      role: 'ESTAGIÁRIA',
    },
  })

  // trilhas
  const lgpd = await prisma.track.create({
    data: {
      slug: 'lgpd',
      title: 'LGPD na Prática',
      description: 'Conformidade e boas práticas',
    },
  })

  const etica = await prisma.track.create({
    data: {
      slug: 'etica',
      title: 'Ética Profissional',
      description: 'Conduta e responsabilidades',
    },
  })

  // assignments (risco diferente para cada)
  await prisma.assignment.create({
    data: {
      personId: ana.id,
      trackId: lgpd.id,
      progress: 85,
      risk: RiskLevel.LOW,
    },
  })

  await prisma.assignment.create({
    data: {
      personId: bruno.id,
      trackId: etica.id,
      progress: 45,
      risk: RiskLevel.HIGH,
    },
  })

  await prisma.assignment.create({
    data: {
      personId: carla.id,
      trackId: lgpd.id,
      progress: 15,
      risk: RiskLevel.CRITICAL,
    },
  })

  console.log('✅ Seed demo executado com sucesso')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
