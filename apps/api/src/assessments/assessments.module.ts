import { Module } from '@nestjs/common'
import { AssessmentsService } from './assessments.service'
import { AssessmentsController } from './assessments.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { AuditModule } from '../audit/audit.module'
import { RiskModule } from '../risk/risk.module'

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    RiskModule,
  ],
  controllers: [AssessmentsController],
  providers: [
    AssessmentsService,
  ],
})
export class AssessmentsModule {}
