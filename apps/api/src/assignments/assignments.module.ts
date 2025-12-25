import { Module, forwardRef } from '@nestjs/common'
import { AssignmentsService } from './assignments.service'
import { AssignmentsController } from './assignments.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { AuditModule } from '../audit/audit.module'
import { TracksModule } from '../tracks/tracks.module'

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    forwardRef(() => TracksModule),
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
