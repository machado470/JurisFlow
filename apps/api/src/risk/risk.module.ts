import { Module } from '@nestjs/common'
import { RiskService } from './risk.service'
import { PrismaModule } from '../prisma/prisma.module'
import { AuditModule } from '../audit/audit.module'

@Module({
  imports: [
    PrismaModule,
    AuditModule,
  ],
  providers: [RiskService],
  exports: [RiskService], // 👈 ESSENCIAL
})
export class RiskModule {}
