import { Module, forwardRef } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { CorrectiveActionsModule } from '../corrective-actions/corrective-actions.module'

import { RiskService } from './risk.service'
import { RiskSnapshotService } from './risk-snapshot.service'
import { TemporalRiskService } from './temporal-risk.service'
import { RiskAutomationService } from './risk-automation.service'

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => CorrectiveActionsModule),
  ],
  providers: [
    RiskService,
    RiskSnapshotService,
    RiskAutomationService,
    TemporalRiskService,
  ],
  exports: [
    RiskService,
    RiskSnapshotService,
    TemporalRiskService,
  ],
})
export class RiskModule {}
