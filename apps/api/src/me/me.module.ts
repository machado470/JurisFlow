import { Module } from '@nestjs/common'
import { PeopleModule } from '../people/people.module'
import { AssignmentsModule } from '../assignments/assignments.module'

import { MeController } from './me.controller'

@Module({
  imports: [
    PeopleModule,
    AssignmentsModule,
  ],
  controllers: [
    MeController,
  ],
})
export class MeModule {}
