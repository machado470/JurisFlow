import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { PeopleService } from './people.service'
import { PeopleController } from './people.controller'

@Module({
  controllers: [PeopleController],
  providers: [PeopleService, PrismaService],
})
export class PeopleModule {}
