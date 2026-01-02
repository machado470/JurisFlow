import {
  PrismaClient,
  RiskLevel,
  CorrectiveStatus,
  TimelineSeverity,
} from '@prisma/client'

const prisma = new PrismaClient()

async function upsertPersonByEmail(params: {
  name: string
  email: string
  role: string
  riskScore: number
  orgId: string
}) {
  const existing = await prisma.person.findFirst({
    where: {
      email: params.email,
      orgId: params.orgId,
    },
  })

  if (existing) {
    return prisma.person.update({
      where: { id: existing.id },
      data: {
        riskScore: params.riskScore,
      },
    })
  }

  return prisma.person.create({
    data: {
      name: params.name,
      email: params.email,
      role: params.role,
      riskScore: params.riskScore,
      orgId: params.orgId,
    },
  })
}

async function main() {
  // =========================
  // ORGANIZATION
  // =========================
  const org = await prisma.organization.upsert({
    where: { slug: 'autoescola-demo' },
    update: {},
    create: {
      name: 'AutoEscola Demo',
      slug: 'autoescola-demo',
      requiresOnboarding: false,
    },
  })

  // =========================
  // ADMIN USER + PERSON
  // =========================
  await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: { active: true },
    create: {
      email: 'admin@demo.com',
      password: '123456',
      role: 'ADMIN',
      active: true,
      orgId: org.id,
      person: {
        create: {
          name: 'Administrador Demo',
          role: 'ADMIN',
          orgId: org.id,
        },
      },
    },
  })

  // =========================
  // TRACK
  // =========================
  const track = await prisma.track.upsert({
    where: { slug: 'treinamento-obrigatorio' },
    update: {},
    create: {
      title: 'Treinamento Obrigatório',
      slug: 'treinamento-obrigatorio',
      description: 'Trilha base para validação de risco',
    },
  })

  // =========================
  // PERSONS (CORRETO)
  // =========================
  const criticalPerson = await upsertPersonByEmail({
    name: 'João Silva',
    email: 'joao@demo.com',
    role: 'COLLABORATOR',
    riskScore: 90,
    orgId: org.id,
  })

  const warningPerson = await upsertPersonByEmail({
    name: 'Maria Souza',
    email: 'maria@demo.com',
    role: 'COLLABORATOR',
    riskScore: 60,
    orgId: org.id,
  })

  // =========================
  // ASSIGNMENTS
  // =========================
  await prisma.assignment.upsert({
    where: {
      personId_trackId: {
        personId: criticalPerson.id,
        trackId: track.id,
      },
    },
    update: {
      risk: RiskLevel.CRITICAL,
      progress: 20,
    },
    create: {
      personId: criticalPerson.id,
      trackId: track.id,
      risk: RiskLevel.CRITICAL,
      progress: 20,
    },
  })

  await prisma.assignment.upsert({
    where: {
      personId_trackId: {
        personId: warningPerson.id,
        trackId: track.id,
      },
    },
    update: {
      risk: RiskLevel.HIGH,
      progress: 60,
    },
    create: {
      personId: warningPerson.id,
      trackId: track.id,
      risk: RiskLevel.HIGH,
      progress: 60,
    },
  })

  // =========================
  // CORRECTIVE ACTION
  // =========================
  await prisma.correctiveAction.create({
    data: {
      personId: criticalPerson.id,
      reason: 'Treinamento obrigatório não concluído',
      status: CorrectiveStatus.OPEN,
    },
  })

  // =========================
  // TIMELINE EVENTS
  // =========================
  await prisma.event.create({
    data: {
      personId: criticalPerson.id,
      type: 'RISK_ESCALATION',
      severity: TimelineSeverity.CRITICAL,
      description: 'Risco elevado detectado automaticamente',
    },
  })

  await prisma.event.create({
    data: {
      personId: warningPerson.id,
      type: 'RISK_WARNING',
      severity: TimelineSeverity.WARNING,
      description: 'Risco médio-alto identificado',
    },
  })

  console.log('✅ Seed executivo aplicado com sucesso')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
