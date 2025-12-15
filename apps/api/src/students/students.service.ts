import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    // 1️⃣ Usuário autenticado
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      return {
        user: null,
        categories: [],
      }
    }

    // 2️⃣ Estrutura educacional (neutra, sem regra)
    const categories = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        phases: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    })

    // 3️⃣ Formato FINAL do contrato
    return {
      user,
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        phases: category.phases.map(phase => ({
          id: phase.id,
          name: phase.name,
          lessons: phase.lessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
          })),
        })),
      })),
    }
  }
}
