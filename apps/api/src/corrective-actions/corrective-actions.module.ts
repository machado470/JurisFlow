import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { TimelineModule } from '../timeline/timeline.module'
import { OperationalStateModule } from '../people/operational-state.module'

import { CorrectiveActionsService } from './corrective-actions.service'
import { CorrectiveActionsController } from './corrective-actions.controller'

@Module({
  imports: [
    PrismaModule,
    TimelineModule,
    OperationalStateModule,
  ],
  providers: [
    CorrectiveActionsService,
  ],
  controllers: [
    CorrectiveActionsController,
  ],
  exports: [
    CorrectiveActionsService,
  ],
})
export class CorrectiveActionsModule {}
