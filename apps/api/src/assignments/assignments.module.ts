import { Module } from '@nestjs/common'
import { AssignmentsService } from './assignments.service'
import { AssignmentsController } from './assignments.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { TimelineModule } from '../timeline/timeline.module'

@Module({
  imports: [PrismaModule, TimelineModule],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
