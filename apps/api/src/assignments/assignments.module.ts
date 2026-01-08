import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AuditModule } from '../audit/audit.module'
import { RiskModule } from '../risk/risk.module'
import { PeopleModule } from '../people/people.module'
import { TimelineModule } from '../timeline/timeline.module'

import { AssignmentsService } from './assignments.service'
import { AssignmentsController } from './assignments.controller'

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    RiskModule,
    PeopleModule,
    TimelineModule,
  ],
  providers: [
    AssignmentsService,
  ],
  controllers: [
    AssignmentsController,
  ],
  exports: [
    AssignmentsService,
  ],
})
export class AssignmentsModule {}
