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
      description: 'Execução da trilha iniciada',
    })

    return updated
  }

  /**
   * 🧠 PRÓXIMO ITEM DA TRILHA
   */
  async getNextItem(assignmentId: string) {
    const assignment =
      await this.prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
          track: {
            include: {
              items: {
                orderBy: { order: 'asc' },
              },
            },
          },
          completions: true,
        },
      })

    if (!assignment) {
      throw new NotFoundException(
        'Assignment não encontrado',
      )
    }

    const completedItemIds = new Set(
      assignment.completions.map(c => c.itemId),
    )

    return (
      assignment.track.items.find(
        item => !completedItemIds.has(item.id),
      ) ?? null
    )
  }

  /**
   * ✅ CONCLUI ITEM DA TRILHA
   */
  async completeItem(
    assignmentId: string,
    itemId: string,
  ) {
    const assignment =
      await this.prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
          track: {
            include: {
              items: {
                orderBy: { order: 'asc' },
              },
            },
          },
          completions: true,
        },
      })

    if (!assignment) {
      throw new NotFoundException(
        'Assignment não encontrado',
      )
    }

    const completedItemIds = new Set(
      assignment.completions.map(c => c.itemId),
    )

    if (completedItemIds.has(itemId)) {
      throw new BadRequestException(
        'Item já concluído',
      )
    }

    const nextItem = assignment.track.items.find(
      item => !completedItemIds.has(item.id),
    )

    if (!nextItem || nextItem.id !== itemId) {
      throw new BadRequestException(
        'Este item não é o próximo da trilha',
      )
    }

    await this.prisma.trackItemCompletion.create({
      data: {
        itemId,
        personId: assignment.personId,
        assignmentId: assignment.id,
      },
    })

    const totalItems = assignment.track.items.length
    const completedCount = completedItemIds.size + 1

    const progress = Math.round(
      (completedCount / totalItems) * 100,
    )

    await this.prisma.assignment.update({
      where: { id: assignment.id },
      data: { progress },
    })

    await this.timeline.log({
      action: 'TRACK_ITEM_COMPLETED',
      personId: assignment.personId,
      description: `Item concluído (${completedCount}/${totalItems})`,
      metadata: {
        assignmentId,
        itemId,
        progress,
      },
    })

    return {
      completed: true,
      progress,
      finished: completedCount === totalItems,
    }
  }

  async updateProgress(
    assignmentId: string,
    progress: number,
  ) {
    if (progress < 0 || progress >= 100) {
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

    if (assignment.progress >= 100) {
      return assignment
    }

    const updated =
      await this.prisma.assignment.update({
        where: { id: assignmentId },
        data: { progress },
      })

    await this.timeline.log({
      action: 'ASSIGNMENT_PROGRESS_UPDATED',
      personId: assignment.personId,
      metadata: { progress },
    })

    return updated
  }
}
