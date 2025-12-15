import { Module } from '@nestjs/common'
import { AssignmentsController } from './assignments.controller'
import { AssignmentsService } from './assignments.service'

@Module({
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService], // 👈 OBRIGATÓRIO
})
export class AssignmentsModule {}
