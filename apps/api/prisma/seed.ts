import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@autoescola.com'
  const password = await bcrypt.hash('123456', 10)

  const admin = await prisma.user.findUnique({
    where: { email },
  })

  if (!admin) {
    await prisma.user.create({
      data: {
        email,
        password,
        role: 'ADMIN',
      },
    })

    console.log('✅ Admin criado')
  } else {
    console.log('ℹ️ Admin já existe, seed ignorado')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
