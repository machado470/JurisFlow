import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const totalUsers = await this.prisma.user.count();
    const totalStudents = await this.prisma.user.count({
      where: { role: 'STUDENT' },
    });
    const totalAdmins = await this.prisma.user.count({
      where: { role: 'ADMIN' },
    });
    const totalCategories = await this.prisma.category.count();
    const totalLessons = await this.prisma.lesson.count();
    const totalQuestions = await this.prisma.question.count();

    return {
      users: totalUsers,
      students: totalStudents,
      admins: totalAdmins,
      categories: totalCategories,
      lessons: totalLessons,
      questions: totalQuestions,
    };
  }
}
