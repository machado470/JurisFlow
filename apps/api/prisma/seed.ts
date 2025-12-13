import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.user.upsert({
    where: { email: 'admin@autoescola.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@autoescola.com',
      passwordHash: 'admin123',
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log('✅ Seed finalizado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
