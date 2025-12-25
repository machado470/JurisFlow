import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed JurisFlow iniciado')

  // 1. Organização (idempotente)
  const org = await prisma.organization.upsert({
    where: { slug: 'jurisflow-demo' },
    update: {},
    create: {
      name: 'JurisFlow Demo',
      slug: 'jurisflow-demo',
    },
  })

  // 2. Pessoa admin (idempotente por org + role)
  const person =
    (await prisma.person.findFirst({
      where: {
        orgId: org.id,
        role: 'ADMIN',
      },
    })) ??
    (await prisma.person.create({
      data: {
        name: 'Administrador',
        role: 'ADMIN',
        orgId: org.id,
      },
    }))

  // 3. Usuário admin (idempotente por email)
  await prisma.user.upsert({
    where: { email: 'admin@jurisflow.local' },
    update: {},
    create: {
      email: 'admin@jurisflow.local',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      orgId: org.id,
      personId: person.id,
      active: true,
    },
  })

  console.log('✅ Seed finalizado com sucesso')
}

main()
  .catch(e => {
    console.error('❌ Seed falhou', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
