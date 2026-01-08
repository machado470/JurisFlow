import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'

import { RiskService } from './risk.service'
import { TemporalRiskService } from './temporal-risk.service'
import { RiskSnapshotService } from './risk-snapshot.service'
import { PersonSuspensionService } from './person-suspension.service'

@Module({
  imports: [PrismaModule],
  providers: [
    RiskService,
    TemporalRiskService,
    RiskSnapshotService,
    PersonSuspensionService,
  ],
  exports: [
    RiskService,
    TemporalRiskService,
    RiskSnapshotService,
    PersonSuspensionService,
  ],
})
export class RiskModule {}
