import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { TimelineService } from '../timeline/timeline.service'
import { RiskLevel } from '@prisma/client'

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
    })
  }

  async startAssignment(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    })

    if (!assignment) return null
    if (assignment.progress > 0) return assignment

    const updated = await this.prisma.assignment.update({
      where: { id },
      data: { progress: 1 },
    })

    await this.timeline.log({
      type: 'ASSIGNMENT_STARTED',
      personId: assignment.personId,
    })

    return updated
  }

  async completeAssignment(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    })

    if (!assignment) return null
    if (assignment.progress === 100) return assignment

    const updated = await this.prisma.assignment.update({
      where: { id },
      data: {
        progress: 100,
        risk: RiskLevel.LOW,
      },
    })

    await this.timeline.log({
      type: 'ASSIGNMENT_COMPLETED',
      personId: assignment.personId,
    })

    return updated
  }
}
