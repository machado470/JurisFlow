import { Module } from '@nestjs/common'

import { PrismaModule } from './prisma/prisma.module'
import { HealthModule } from './health/health.module'
import { AuthModule } from './auth/auth.module'

import { PersonsModule } from './persons/persons.module'
import { PeopleModule } from './people/people.module'
import { AssignmentsModule } from './assignments/assignments.module'
import { AssessmentsModule } from './assessments/assessments.module'
import { RiskModule } from './risk/risk.module'
import { AuditModule } from './audit/audit.module'
import { ReportsModule } from './reports/reports.module'

import { CorrectiveActionsModule } from './corrective-actions/corrective-actions.module'

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,

    // núcleo de pessoas
    PersonsModule,
    PeopleModule,

    // domínio educacional
    AssignmentsModule,
    AssessmentsModule,

    // risco e auditoria
    RiskModule,
    AuditModule,

    // ações corretivas e relatórios
    CorrectiveActionsModule,
    ReportsModule,
  ],
})
export class AppModule {}
