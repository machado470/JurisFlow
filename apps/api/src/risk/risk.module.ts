import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { TimelineModule } from '../timeline/timeline.module'

import { RiskService } from './risk.service'
import { TemporalRiskService } from './temporal-risk.service'
import { TemporalRiskRepository } from './temporal-risk.repository'
import { PersonSuspensionService } from './person-suspension.service'
import { RiskSnapshotService } from './risk-snapshot.service'

@Module({
  imports: [
    PrismaModule,
    TimelineModule,
  ],
  providers: [
    RiskService,
    TemporalRiskService,
    TemporalRiskRepository,
    PersonSuspensionService,
    RiskSnapshotService,
  ],
  exports: [
    RiskService,
    TemporalRiskService,
    RiskSnapshotService,
  ],
})
export class RiskModule {}
