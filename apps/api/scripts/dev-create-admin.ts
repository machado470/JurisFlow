import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@autoescola.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@autoescola.com',
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
