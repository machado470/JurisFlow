import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TimelineService } from '../timeline/timeline.service'

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly timeline: TimelineService,
  ) {}

  async listOpenByPerson(personId: string) {
    return this.prisma.assignment.findMany({
      where: {
        personId,
        progress: { lt: 100 },
      },
      include: {
        track: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async startAssignment(assignmentId: string) {
    const assignment =
      await this.prisma.assignment.findUnique({
        where: { id: assignmentId },
      })

    if (!assignment) {
      throw new NotFoundException(
        'Assignment não encontrado',
      )
    }

    if (assignment.progress > 0) {
      return assignment
    }

    const updated =
      await this.prisma.assignment.update({
        where: { id: assignmentId },
        data: { progress: 1 },
      })

    await this.timeline.log({
      action: 'ASSIGNMENT_STARTED',
      personId: assignment.personId,
    })

    return updated
  }

  async updateProgress(
    assignmentId: string,
    progress: number,
  ) {
    if (progress < 0 || progress > 100) {
      throw new BadRequestException(
        'Progresso inválido',
      )
    }

    const assignment =
      await this.prisma.assignment.findUnique({
        where: { id: assignmentId },
      })

    if (!assignment) {
      throw new NotFoundException(
        'Assignment não encontrado',
      )
    }

    const updated =
      await this.prisma.assignment.update({
        where: { id: assignmentId },
        data: { progress },
      })

    await this.timeline.log({
      action: 'ASSIGNMENT_PROGRESS_UPDATED',
      personId: assignment.personId,
    })

    return updated
  }

  async completeAssignment(assignmentId: string) {
    const assignment =
      await this.prisma.assignment.findUnique({
        where: { id: assignmentId },
      })

    if (!assignment) {
      throw new NotFoundException(
        'Assignment não encontrado',
      )
    }

    const updated =
      await this.prisma.assignment.update({
        where: { id: assignmentId },
        data: { progress: 100 },
      })

    await this.timeline.log({
      action: 'ASSIGNMENT_COMPLETED',
      personId: assignment.personId,
    })

    return updated
  }
}
