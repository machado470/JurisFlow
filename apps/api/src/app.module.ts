import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';
import { PhasesModule } from './phases/phases.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuestionsModule } from './questions/questions.module';
import { SimulationsModule } from './simulations/simulations.module';
import { StudentsModule } from './students/students.module';
import { HealthModule } from './health/health.module';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    AdminModule,
    CategoriesModule,
    PhasesModule,
    LessonsModule,
    QuestionsModule,
    SimulationsModule,
    StudentsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // 1️⃣ valida JWT e injeta user
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,   // 2️⃣ valida role (@Roles)
    },
  ],
})
export class AppModule {}
