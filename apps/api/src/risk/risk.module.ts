import { Module } from '@nestjs/common'
import { RiskService } from './risk.service'
import { RiskController } from './risk.controller'
import { PeopleModule } from '../people/people.module'
import { AssignmentsModule } from '../assignments/assignments.module'
import { ProgressModule } from '../progress/progress.module'

@Module({
  imports: [
    PeopleModule,
    AssignmentsModule,
    ProgressModule,
  ],
  controllers: [RiskController],
  providers: [RiskService],
})
export class RiskModule {}
