import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../audit/audit.service'
import { ExceptionsController } from './exceptions.controller'
import { ExceptionsService } from './exceptions.service'

@Module({
  controllers: [ExceptionsController],
  providers: [ExceptionsService, PrismaService, AuditService],
})
export class ExceptionsModule {}
