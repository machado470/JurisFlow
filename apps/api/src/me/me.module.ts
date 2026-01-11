import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AssignmentsModule } from '../assignments/assignments.module'
import { OperationalStateModule } from '../people/operational-state.module'

import { MeController } from './me.controller'

@Module({
  imports: [
    PrismaModule,
    AssignmentsModule,

    // ✅ OBRIGATÓRIO — MeController usa OperationalStateService
    OperationalStateModule,
  ],
  controllers: [
    MeController,
  ],
})
export class MeModule {}
