import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AuditModule } from '../audit/audit.module'
import { RiskModule } from '../risk/risk.module'

import { OperationalStateService } from './operational-state.service'
import { OperationalStateGuard } from './operational-state.guard'
import { OperationalStateController } from './operational-state.controller'
import { OperationalStateRunner } from './operational-state.runner'
import { OperationalStateJob } from './operational-state.job'

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    RiskModule,
  ],
  providers: [
    OperationalStateService,
    OperationalStateGuard,
    OperationalStateJob,
    OperationalStateRunner,
  ],
  controllers: [
    OperationalStateController,
  ],
  exports: [
    OperationalStateService,
    OperationalStateGuard,
    OperationalStateJob,
    OperationalStateRunner,
  ],
})
export class OperationalStateModule {}
