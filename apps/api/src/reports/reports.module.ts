import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { TimelineModule } from '../timeline/timeline.module'
import { RiskModule } from '../risk/risk.module'

import { ReportsService } from './reports.service'
import { ReportsController } from './reports.controller'
import { ExecutiveMetricsService } from './executive-metrics.service'

@Module({
  imports: [
    PrismaModule,
    TimelineModule,
    RiskModule, // 🔥 ISSO RESOLVE TUDO
  ],
  providers: [
    ReportsService,
    ExecutiveMetricsService,
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}
