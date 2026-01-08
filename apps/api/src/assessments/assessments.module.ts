import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { RiskModule } from '../risk/risk.module'
import { AuditModule } from '../audit/audit.module'
import { CorrectiveActionsModule } from '../corrective-actions/corrective-actions.module'
import { PeopleModule } from '../people/people.module'

import { AssessmentsService } from './assessments.service'
import { AssessmentsController } from './assessments.controller'

@Module({
  imports: [
    PrismaModule,
    RiskModule,
    AuditModule,
    CorrectiveActionsModule,
    PeopleModule, // 🔑 OBRIGATÓRIO (OperationalStateGuard)
  ],
  providers: [
    AssessmentsService,
  ],
  controllers: [
    AssessmentsController,
  ],
})
export class AssessmentsModule {}
