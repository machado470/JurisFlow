import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AuditModule } from '../audit/audit.module'
import { RiskModule } from '../risk/risk.module'
import { PeopleModule } from '../people/people.module'

import { CorrectiveActionsService } from './corrective-actions.service'
import { CorrectiveActionsController } from './corrective-actions.controller'

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    RiskModule,
    PeopleModule,
  ],
  providers: [
    CorrectiveActionsService,
  ],
  controllers: [
    CorrectiveActionsController,
  ],
  exports: [
    CorrectiveActionsService,
  ],
})
export class CorrectiveActionsModule {}
