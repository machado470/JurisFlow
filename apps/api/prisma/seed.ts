import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // ----------------------------
  // 🏢 ORGANIZATION
  // ----------------------------
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Organização Demo',
      slug: 'demo-org',
      requiresOnboarding: false,
    },
  })

  // ----------------------------
  // 👤 ADMIN USER
  // ----------------------------
  const passwordHash = await bcrypt.hash('demo', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password: passwordHash,
      role: 'ADMIN',
      active: true,
      orgId: org.id,
    },
  })

  // ----------------------------
  // 🧍 PERSON (ADMIN)
  // ----------------------------
  const person = await prisma.person.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: 'Admin Demo',
      role: 'ADMIN',
      userId: user.id,
      orgId: org.id,
      riskScore: 50,
    },
  })

  // ----------------------------
  // 📚 TRACK
  // ----------------------------
  const track = await prisma.track.upsert({
    where: { slug: 'compliance-basico' },
    update: {},
    create: {
      title: 'Compliance Básico',
      slug: 'compliance-basico',
      description: 'Trilha introdutória de compliance',
    },
  })

  // ----------------------------
  // 🔑 ASSIGNMENT
  // ----------------------------
  await prisma.assignment.upsert({
    where: {
      personId_trackId: {
        personId: person.id,
        trackId: track.id,
      },
    },
    update: {},
    create: {
      personId: person.id,
      trackId: track.id,
      progress: 0,
      risk: 'MEDIUM',
    },
  })

  console.log('✅ Seed aplicado com sucesso')
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
