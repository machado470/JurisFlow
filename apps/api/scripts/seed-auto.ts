import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      name: 'Auto Seed',
      email: 'auto@autoescola.com',
      passwordHash,
      role: 'STUDENT',
      isActive: true,
    },
  });
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
