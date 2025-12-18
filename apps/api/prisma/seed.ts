import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@autoescola.com'
  const password = 'admin123'

  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    console.log('Admin já existe')
    return
  }

  const hash = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      password: hash,
      role: UserRole.ADMIN,
    },
  })

  console.log('Admin criado com sucesso')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
