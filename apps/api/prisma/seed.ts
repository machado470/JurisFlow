import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed JurisFlow iniciado')

  const password = await bcrypt.hash('123456', 10)

  const org = await prisma.organization.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Organização Demo',
      slug: 'demo',
      requiresOnboarding: false,
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {
      password,
      active: true,
      orgId: org.id,
    },
    create: {
      email: 'admin@demo.com',
      password,
      role: UserRole.ADMIN,
      active: true,
      orgId: org.id,
    },
  })

  await prisma.person.upsert({
    where: { userId: user.id },
    update: {
      name: 'Admin Demo',
      role: 'ADMIN',
      active: true,
      orgId: org.id,
    },
    create: {
      name: 'Admin Demo',
      role: 'ADMIN',
      active: true,
      orgId: org.id,
      userId: user.id,
    },
  })

  console.log('✅ Usuário ADMIN criado')
  console.log('📧 admin@demo.com')
  console.log('🔑 123456')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
