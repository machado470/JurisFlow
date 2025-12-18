import { Module } from '@nestjs/common'

import { PrismaModule } from './prisma/prisma.module'
import { HealthModule } from './health/health.module'
import { AuthModule } from './auth/auth.module'

import { PersonsModule } from './persons/persons.module'
import { AssignmentsModule } from './assignments/assignments.module'
import { AssessmentsModule } from './assessments/assessments.module'
import { RiskModule } from './risk/risk.module'
import { AuditModule } from './audit/audit.module'
import { ReportsModule } from './reports/reports.module'

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,

    PersonsModule,
    AssignmentsModule,
    AssessmentsModule, // 👈 NOVO NÚCLEO
    RiskModule,
    AuditModule,
    ReportsModule,
  ],
})
export class AppModule {}
