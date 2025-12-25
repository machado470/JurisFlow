import { Module } from '@nestjs/common'

import { PrismaModule } from './prisma/prisma.module'
import { HealthModule } from './health/health.module'
import { AuthModule } from './auth/auth.module'

// núcleo de pessoas
import { PersonsModule } from './persons/persons.module'
import { PeopleModule } from './people/people.module'

// domínio educacional
import { TracksModule } from './tracks/tracks.module'
import { AssignmentsModule } from './assignments/assignments.module'
import { AssessmentsModule } from './assessments/assessments.module'

// risco e auditoria
import { RiskModule } from './risk/risk.module'
import { AuditModule } from './audit/audit.module'

// ações corretivas e relatórios
import { CorrectiveActionsModule } from './corrective-actions/corrective-actions.module'
import { ReportsModule } from './reports/reports.module'

// leitura estratégica
import { PendingModule } from './pending/pending.module'
import { AdminModule } from './admin/admin.module'

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,

    // núcleo de pessoas
    PersonsModule,
    PeopleModule,

    // domínio educacional
    TracksModule,
    AssignmentsModule, // 🚨 ESTE ERA O BLOQUEIO
    AssessmentsModule,

    // risco e auditoria
    RiskModule,
    AuditModule,

    // ações corretivas e relatórios
    CorrectiveActionsModule,
    ReportsModule,

    // leitura estratégica
    PendingModule,
    AdminModule,
  ],
})
export class AppModule {}
