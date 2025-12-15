import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { AdminModule } from './admin/admin.module'
import { CategoriesModule } from './categories/categories.module'
import { PhasesModule } from './phases/phases.module'
import { LessonsModule } from './lessons/lessons.module'
import { QuestionsModule } from './questions/questions.module'
import { SimulationsModule } from './simulations/simulations.module'
import { StudentsModule } from './students/students.module'
import { HealthModule } from './health/health.module'

import { PeopleModule } from './people/people.module'
import { AssignmentsModule } from './assignments/assignments.module'
import { ProgressModule } from './progress/progress.module'
import { RiskModule } from './risk/risk.module'

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { RolesGuard } from './auth/guards/roles.guard'

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
    PeopleModule,
    AssignmentsModule,
    ProgressModule,
    RiskModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
