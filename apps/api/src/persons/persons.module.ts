import { Module } from '@nestjs/common'
import { PersonsService } from './persons.service'
import { PersonsController } from './persons.controller'
import { PersonsTimelineController } from './persons.timeline.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [
    PersonsController,
    PersonsTimelineController, // 👈 ESSENCIAL
  ],
  providers: [PersonsService, PrismaService],
})
export class PersonsModule {}
