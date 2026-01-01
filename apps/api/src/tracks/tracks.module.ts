import { Module, forwardRef } from '@nestjs/common'
import { TracksService } from './tracks.service'
import { TracksController } from './tracks.controller'
import { PrismaModule } from '../prisma/prisma.module'
import { AssignmentsModule } from '../assignments/assignments.module'

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AssignmentsModule),
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
