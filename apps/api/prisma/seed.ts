import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('demo', 10)

  // ============================
  // ORGANIZATION
  // ============================
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Organização Demo',
      slug: 'demo-org',
      requiresOnboarding: false,
    },
  })

  // ============================
  // ADMIN USER + PERSON
  // ============================
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {
      password: passwordHash,
      active: true,
    },
    create: {
      email: 'admin@demo.com',
      password: passwordHash,
      role: 'ADMIN',
      active: true,
      orgId: org.id,
    },
  })

  await prisma.person.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      name: 'Admin Demo',
      role: 'ADMIN',
      active: true,
      orgId: org.id,
      userId: adminUser.id,
    },
  })

  // ============================
  // COLLABORATOR USER + PERSON
  // ============================
  const collabUser = await prisma.user.upsert({
    where: { email: 'collab@demo.com' },
    update: {
      password: passwordHash,
      active: true,
    },
    create: {
      email: 'collab@demo.com',
      password: passwordHash,
      role: 'COLLABORATOR',
      active: true,
      orgId: org.id,
    },
  })

  const collabPerson = await prisma.person.upsert({
    where: { userId: collabUser.id },
    update: {},
    create: {
      name: 'Colaborador Demo',
      role: 'COLLABORATOR',
      active: true,
      orgId: org.id,
      userId: collabUser.id,
    },
  })

  // ============================
  // TRACK (IDEMPOTENTE 🔒)
  // ============================
  const track = await prisma.track.upsert({
    where: {
      slug_version_orgId: {
        slug: 'trilha-governanca-operacional',
        version: 1,
        orgId: org.id,
      },
    },
    update: {
      title: 'Trilha de Governança Operacional',
      status: 'ACTIVE',
    },
    create: {
      title: 'Trilha de Governança Operacional',
      slug: 'trilha-governanca-operacional',
      version: 1,
      status: 'ACTIVE',
      orgId: org.id,
    },
  })

  // ============================
  // ASSIGNMENT (ATRASADO)
  // ============================
  const pastDate = new Date()
  pastDate.setDate(pastDate.getDate() - 10)

  await prisma.assignment.upsert({
    where: {
      personId_trackId: {
        personId: collabPerson.id,
        trackId: track.id,
      },
    },
    update: {},
    create: {
      personId: collabPerson.id,
      trackId: track.id,
      progress: 20,
      createdAt: pastDate,
    },
  })

  console.log('✅ Seed DEMO aplicado com sucesso')
  console.log('👤 admin@demo.com / demo')
  console.log('👤 collab@demo.com / demo')
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
