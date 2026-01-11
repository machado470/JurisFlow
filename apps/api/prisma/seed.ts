import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('demo', 10)

  // ----------------------------
  // ORGANIZATION
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
  // ADMIN USER
  // ----------------------------
  const user = await prisma.user.upsert({
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

  // ----------------------------
  // PERSON (SEPARADO, EXPLÍCITO)
  // ----------------------------
  await prisma.person.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      name: 'Admin Demo',
      role: 'ADMIN',
      active: true,
      orgId: org.id,
      userId: user.id,
    },
  })

  console.log('✅ Seed aplicado com organização, usuário e pessoa válidos')
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
