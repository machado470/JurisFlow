import { Module } from '@nestjs/common'
import { AssessmentsService } from './assessments.service'
import { AssessmentsController } from './assessments.controller'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../audit/audit.service'

@Module({
  controllers: [AssessmentsController],
  providers: [
    AssessmentsService,
    PrismaService,
    AuditService,
  ],
})
export class AssessmentsModule {}
