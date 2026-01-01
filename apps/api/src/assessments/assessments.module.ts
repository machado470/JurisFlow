import { Module, forwardRef } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

import { AssessmentsController } from './assessments.controller'
import { AssessmentsService } from './assessments.service'

import { RiskModule } from '../risk/risk.module'
import { AuditModule } from '../audit/audit.module'
import { CorrectiveActionsModule } from '../corrective-actions/corrective-actions.module'

@Module({
  imports: [
    RiskModule,
    AuditModule,
    forwardRef(() => CorrectiveActionsModule),
  ],
  controllers: [AssessmentsController],
  providers: [
    AssessmentsService,
    PrismaService,
  ],
})
export class AssessmentsModule {}
