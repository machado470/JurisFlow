import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PrismaModule } from './prisma/prisma.module'
import { HealthModule } from './health/health.module'
import { AuthModule } from './auth/auth.module'
import { MeModule } from './me/me.module'
import { OnboardingModule } from './onboarding/onboarding.module'

// núcleo de pessoas
import { PersonsModule } from './persons/persons.module'
import { PeopleModule } from './people/people.module'

// domínio educacional
import { TracksModule } from './tracks/tracks.module'
import { AssignmentsModule } from './assignments/assignments.module'
import { AssessmentsModule } from './assessments/assessments.module'

// risco, tempo e auditoria
import { RiskModule } from './risk/risk.module'
import { AuditModule } from './audit/audit.module'

// ações corretivas e relatórios
import { CorrectiveActionsModule } from './corrective-actions/corrective-actions.module'
import { ReportsModule } from './reports/reports.module'

// leitura estratégica
import { PendingModule } from './pending/pending.module'
import { AdminModule } from './admin/admin.module'

// timeline
import { TimelineModule } from './timeline/timeline.module'

// exceções humanas
import { ExceptionsModule } from './exceptions/exceptions.module'

// 🧠 GOVERNANÇA OPERACIONAL
import { GovernanceModule } from './governance/governance.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    HealthModule,
    AuthModule,
    MeModule,
    OnboardingModule,

    PersonsModule,
    PeopleModule,

    TracksModule,
    AssignmentsModule,
    AssessmentsModule,

    RiskModule,
    AuditModule,

    CorrectiveActionsModule,
    ReportsModule,

    PendingModule,
    AdminModule,
    TimelineModule,

    ExceptionsModule,

    // 🔥 MOTOR DE GOVERNANÇA
    GovernanceModule,
  ],
})
export class AppModule {}
