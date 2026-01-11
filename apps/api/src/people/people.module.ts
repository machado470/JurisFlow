import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { RiskModule } from '../risk/risk.module'
import { OperationalStateModule } from './operational-state.module'

@Module({
  imports: [
    PrismaModule,
    RiskModule,
    OperationalStateModule,
  ],
})
export class PeopleModule {}
