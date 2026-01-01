import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AssignmentsModule } from '../assignments/assignments.module'
import { RiskModule } from '../risk/risk.module'

import { PersonsService } from './persons.service'
import { PersonsController } from './persons.controller'
import { PersonsTimelineController } from './persons.timeline.controller'
import { PersonsRiskHistoryController } from './persons.risk-history.controller'
import { PersonsReminderController } from './persons.reminder.controller'

@Module({
  imports: [
    PrismaModule,
    AssignmentsModule,
    RiskModule,
  ],
  controllers: [
    PersonsController,
    PersonsTimelineController,
    PersonsRiskHistoryController,
    PersonsReminderController,
  ],
  providers: [PersonsService],
  exports: [PersonsService],
})
export class PersonsModule {}
