import { Module } from '@nestjs/common'
import { ReportsController } from './reports.controller'
import { ReportsService } from './reports.service'
import { RiskModule } from '../risk/risk.module'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [
    PrismaModule,
    RiskModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
