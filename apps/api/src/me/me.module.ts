import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { MeController } from './me.controller'
import { RiskModule } from '../risk/risk.module'
import { AssignmentsModule } from '../assignments/assignments.module'

@Module({
  imports: [
    PrismaModule,
    RiskModule,
    AssignmentsModule,
  ],
  controllers: [
    MeController, // 🧠 EXPOSTO AQUI
  ],
})
export class MeModule {}
