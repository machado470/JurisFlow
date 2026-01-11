import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { TimelineModule } from '../timeline/timeline.module'
import { AuditModule } from '../audit/audit.module'
import { OperationalStateModule } from '../people/operational-state.module'

import { EnforcementPolicyService } from './enforcement-policy.service'
import { EnforcementEngineService } from './enforcement-engine.service'
import { EnforcementJob } from './enforcement.job'
import { EnforcementController } from './enforcement.controller'

@Module({
  imports: [
    PrismaModule,
    TimelineModule,
    AuditModule,

    // precisa ler status operacional
    OperationalStateModule,
  ],
  providers: [
    EnforcementPolicyService,
    EnforcementEngineService,
    EnforcementJob,
  ],
  controllers: [
    EnforcementController,
  ],
  exports: [
    EnforcementEngineService,
  ],
})
export class GovernanceModule {}
