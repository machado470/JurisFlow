import { Module } from '@nestjs/common'
import { ReportsController } from './reports.controller'
import { RiskModule } from '../risk/risk.module'
import { AssignmentsModule } from '../assignments/assignments.module'
import { AuditModule } from '../audit/audit.module'

@Module({
  imports: [RiskModule, AssignmentsModule, AuditModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
