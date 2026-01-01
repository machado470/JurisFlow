import { Module } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { OnboardingController } from './onboarding.controller'

@Module({
  controllers: [OnboardingController],
  providers: [PrismaService],
})
export class OnboardingModule {}
