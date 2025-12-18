import { PrismaClient, UserRole } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('▶️ Seed AUTH iniciado')

  const password = await bcrypt.hash('123456', 10)

  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      password,
      role: UserRole.ADMIN,
    },
  })

  console.log('✅ Usuário ADMIN criado')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
