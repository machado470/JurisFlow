import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('⚖️ Seed Jurídico – Direito do Trabalho iniciado')

  // ===== ADMIN =====
  await prisma.user.upsert({
    where: { email: 'admin@jurisflow.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@jurisflow.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: Role.ADMIN,
      isActive: true,
    },
  })
  console.log('✅ Admin ok')

  // ===== STUDENT =====
  await prisma.user.upsert({
    where: { email: 'aluno@jurisflow.com' },
    update: {},
    create: {
      name: 'Aluno Jurídico',
      email: 'aluno@jurisflow.com',
      passwordHash: await bcrypt.hash('123456', 10),
      role: Role.STUDENT,
      isActive: true,
    },
  })
  console.log('👨‍⚖️ Student ok')

  // ===== CATEGORY =====
  let category = await prisma.category.findFirst({
    where: { name: 'Direito do Trabalho' },
  })

  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Direito do Trabalho' },
    })
  }
  console.log('📂 Categoria ok')

  // ===== PHASES =====
  await prisma.phase.deleteMany({
    where: { categoryId: category.id },
  })

  const phases = await prisma.$transaction([
    prisma.phase.create({
      data: { name: 'Fundamentos Trabalhistas', order: 1, categoryId: category.id },
    }),
    prisma.phase.create({
      data: { name: 'Prazos Trabalhistas', order: 2, categoryId: category.id },
    }),
    prisma.phase.create({
      data: { name: 'Peças Processuais', order: 3, categoryId: category.id },
    }),
    prisma.phase.create({
      data: { name: 'Caso Simulado', order: 4, categoryId: category.id },
    }),
  ])
  console.log('📚 Fases ok')

  // ===== LESSONS =====
  await prisma.lesson.deleteMany({
    where: { categoryId: category.id },
  })

  await prisma.lesson.createMany({
    data: [
      {
        title: 'Conceitos Essenciais da CLT',
        order: 1,
        content: 'Vínculo, jornada, salário e subordinação.',
        categoryId: category.id,
        phaseId: phases[0].id,
      },
      {
        title: 'Prazos Trabalhistas',
        order: 1,
        content: 'Prescrição bienal e quinquenal.',
        categoryId: category.id,
        phaseId: phases[1].id,
      },
      {
        title: 'Petição Inicial',
        order: 1,
        content: 'Estrutura básica da reclamação trabalhista.',
        categoryId: category.id,
        phaseId: phases[2].id,
      },
      {
        title: 'Caso Simulado',
        order: 1,
        content: 'Demissão sem justa causa.',
        categoryId: category.id,
        phaseId: phases[3].id,
      },
    ],
  })
  console.log('📖 Lições ok')

  // ===== QUESTIONS =====
  await prisma.question.deleteMany({
    where: { phaseId: { in: phases.map(p => p.id) } },
  })

  await prisma.question.createMany({
    data: [
      {
        text: 'Qual o prazo para ajuizar ação trabalhista após a demissão?',
        answer: '2 anos',
        phaseId: phases[1].id,
      },
      {
        text: 'Quais verbas são devidas na demissão sem justa causa?',
        answer: 'Saldo de salário, aviso prévio, FGTS + 40%',
        phaseId: phases[3].id,
      },
    ],
  })
  console.log('❓ Perguntas ok')

  console.log('✅ Seed finalizado com sucesso')
}

main()
  .catch(err => {
    console.error('❌ Seed falhou:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

