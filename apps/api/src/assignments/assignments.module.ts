import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { TimelineModule } from '../timeline/timeline.module'
import { OperationalStateModule } from '../people/operational-state.module'

import { AssignmentsService } from './assignments.service'
import { AssignmentsController } from './assignments.controller'

@Module({
  imports: [
    PrismaModule,
    TimelineModule,

    // ✅ OBRIGATÓRIO — por causa do OperationalStateGuard
    OperationalStateModule,
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
