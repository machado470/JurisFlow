import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Aluno',
        email: 'aluno@autoescola.com',
        passwordHash,
        role: 'STUDENT',
        isActive: true,
      },
      {
        name: 'Admin',
        email: 'admin@autoescola.com',
        passwordHash,
        role: 'ADMIN',
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
