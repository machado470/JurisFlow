import { Injectable, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    })

    const categories = await this.prisma.category.findMany({
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: {
            lessons: { orderBy: { order: 'asc' } },
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    const progresses = await this.prisma.studentProgress.findMany({
      where: { userId },
    })

    const completedLessons = await this.prisma.studentLesson.findMany({
      where: { userId },
      select: { lessonId: true },
    })

    const completedSet = new Set(completedLessons.map(l => l.lessonId))

    return {
      student: user,
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        phases: category.phases.map(phase => {
          const progress = progresses.find(p => p.phaseId === phase.id)

          return {
            id: phase.id,
            name: phase.name,
            totalLessons: phase.lessons.length,
            completedLessons: progress?.lessonsCompleted ?? 0,
            progressPercent: phase.lessons.length
              ? Math.round(((progress?.lessonsCompleted ?? 0) / phase.lessons.length) * 100)
              : 0,
            finished: progress?.finished ?? false,

            // 🔥 AQUI ESTAVA O PROBLEMA
            lessons: phase.lessons.map(lesson => ({
              id: lesson.id,
              title: lesson.title,
              completed: completedSet.has(lesson.id),
            })),
          }
        }),
      })),
    }
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    })
    if (!lesson) throw new ForbiddenException('Lição inválida')

    await this.prisma.studentLesson.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {},
      create: { userId, lessonId },
    })

    const totalLessons = await this.prisma.lesson.count({
      where: { phaseId: lesson.phaseId },
    })

    const completed = await this.prisma.studentLesson.count({
      where: {
        userId,
        lesson: { phaseId: lesson.phaseId },
      },
    })

    await this.prisma.studentProgress.upsert({
      where: {
        userId_phaseId: { userId, phaseId: lesson.phaseId },
      },
      update: {
        lessonsCompleted: completed,
        finished: completed >= totalLessons,
      },
      create: {
        userId,
        phaseId: lesson.phaseId,
        lessonsCompleted: completed,
        finished: completed >= totalLessons,
      },
    })

    return { ok: true }
  }
}
