import { PrismaClient, UserRole, RiskLevel } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed JurisFlow...')

  // =========================
  // ADMIN
  // =========================
  const adminPassword = await bcrypt.hash('admin123', 10)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@jurisflow.com' },
    update: {},
    create: {
      email: 'admin@jurisflow.com',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  })

  console.log('✅ Admin criado:', adminUser.email)

  // =========================
  // TRILHAS MODELO
  // =========================
  const onboardingTrack = await prisma.track.upsert({
    where: { slug: 'onboarding-juridico' },
    update: {},
    create: {
      slug: 'onboarding-juridico',
      title: 'Onboarding Jurídico – Básico',
      description:
        'Introdução aos procedimentos internos, ética e responsabilidades.',
    },
  })

  const lgpdTrack = await prisma.track.upsert({
    where: { slug: 'lgpd-escritorios' },
    update: {},
    create: {
      slug: 'lgpd-escritorios',
      title: 'LGPD para Escritórios',
      description:
        'Boas práticas de proteção de dados e conformidade legal.',
    },
  })

  console.log('✅ Trilhas criadas')

  // =========================
  // COLABORADORES
  // =========================
  const collaborators = [
    {
      name: 'João Silva',
      email: 'joao@jurisflow.com',
    },
    {
      name: 'Maria Souza',
      email: 'maria@jurisflow.com',
    },
  ]

  for (const c of collaborators) {
    const person = await prisma.person.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        role: 'COLLABORATOR',
      },
    })

    const password = await bcrypt.hash('123456', 10)

    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        password,
        role: UserRole.COLLABORATOR,
        personId: person.id,
      },
    })

    // =========================
    // ATRIBUIÇÃO AUTOMÁTICA
    // =========================
    await prisma.assignment.upsert({
      where: {
        personId_trackId: {
          personId: person.id,
          trackId: onboardingTrack.id,
        },
      },
      update: {},
      create: {
        personId: person.id,
        trackId: onboardingTrack.id,
        progress: 0,
        risk: RiskLevel.LOW,
      },
    })

    console.log(`✅ Colaborador criado e atribuído: ${c.email}`)
  }

  console.log('🌱 Seed finalizado com sucesso')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
