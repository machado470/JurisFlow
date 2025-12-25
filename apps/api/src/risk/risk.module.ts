import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AuditModule } from '../audit/audit.module'
import { RiskService } from './risk.service'
import { RiskSnapshotService } from './risk-snapshot.service'

@Module({
  imports: [
    PrismaModule,
    AuditModule,
  ],
  providers: [
    RiskService,
    RiskSnapshotService,
  ],
  exports: [
    RiskService,
    RiskSnapshotService,
  ],
})
export class RiskModule {}
