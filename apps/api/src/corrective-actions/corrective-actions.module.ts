import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RiskModule } from '../risk/risk.module'

import { CorrectiveActionsService } from './corrective-actions.service'
import { CorrectiveActionsController } from './corrective-actions.controller'

@Module({
  imports: [RiskModule], // 👈 ESSA LINHA RESOLVE TUDO
  controllers: [CorrectiveActionsController],
  providers: [CorrectiveActionsService, PrismaService],
})
export class CorrectiveActionsModule {}
