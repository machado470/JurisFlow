import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { RiskModule } from '../risk/risk.module'
import { CorrectiveActionsController } from './corrective-actions.controller'
import { CorrectiveActionsService } from './corrective-actions.service'

@Module({
  imports: [
    PrismaModule,
    RiskModule,
  ],
  controllers: [CorrectiveActionsController],
  providers: [CorrectiveActionsService],
})
export class CorrectiveActionsModule {}
