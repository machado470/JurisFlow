import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { AuditModule } from '../audit/audit.module'
import { RiskModule } from '../risk/risk.module'

import { PeopleService } from './people.service'
import { PeopleController } from './people.controller'
import { OperationalStateModule } from './operational-state.module'

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    RiskModule,
    OperationalStateModule,
  ],
  providers: [
    PeopleService,
  ],
  controllers: [
    PeopleController,
  ],
  exports: [
    PeopleService,
    OperationalStateModule,
  ],
})
export class PeopleModule {}
