import { PrismaClient, UserRole, RiskLevel } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed JurisFlow...')

  // =========================
  // ORGANIZAÇÃO
  // =========================
  const org = await prisma.organization.upsert({
    where: { slug: 'escritorio-demo' },
    update: {},
    create: {
      name: 'Escritório Demo',
      slug: 'escritorio-demo',
    },
  })

  // =========================
  // ADMIN
  // =========================
  const adminPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@jurisflow.com' },
    update: {},
    create: {
      email: 'admin@jurisflow.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      orgId: org.id,
    },
  })

  // =========================
  // TRILHA
  // =========================
  const onboardingTrack = await prisma.track.upsert({
    where: { slug: 'onboarding-juridico' },
    update: {},
    create: {
      slug: 'onboarding-juridico',
      title: 'Onboarding Jurídico – Básico',
    },
  })

  // =========================
  // COLABORADORES
  // =========================
  const collaborators = [
    { name: 'João Silva', email: 'joao@jurisflow.com' },
    { name: 'Maria Souza', email: 'maria@jurisflow.com' },
  ]

  for (const c of collaborators) {
    // 🔎 procurar pessoa dentro da organização
    let person = await prisma.person.findFirst({
      where: {
        email: c.email,
        orgId: org.id,
      },
    })

    // ➕ criar se não existir
    if (!person) {
      person = await prisma.person.create({
        data: {
          name: c.name,
          email: c.email,
          role: 'COLLABORATOR',
          orgId: org.id,
        },
      })
    }

    const password = await bcrypt.hash('123456', 10)

    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        password,
        role: UserRole.COLLABORATOR,
        personId: person.id,
        orgId: org.id,
      },
    })

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
        risk: RiskLevel.LOW,
      },
    })
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
