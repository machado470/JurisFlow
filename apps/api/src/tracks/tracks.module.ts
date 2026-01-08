import { Module, forwardRef } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AssignmentsModule } from '../assignments/assignments.module'
import { AuditModule } from '../audit/audit.module'

import { TracksService } from './tracks.service'
import { TracksController } from './tracks.controller'

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    forwardRef(() => AssignmentsModule),
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
