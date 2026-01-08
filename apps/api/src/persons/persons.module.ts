import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { PersonsController } from './persons.controller'
import { PersonsService } from './persons.service'
import { PersonsTimelineController } from './persons-timeline.controller'
import { TimelineModule } from '../timeline/timeline.module'

@Module({
  imports: [PrismaModule, TimelineModule],
  controllers: [
    PersonsController,
    PersonsTimelineController,
  ],
  providers: [PersonsService],
})
export class PersonsModule {}
