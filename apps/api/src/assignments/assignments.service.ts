import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RiskLevel } from '@prisma/client'
import { AuditService } from '../audit/audit.service'

@Injectable()
export class AssignmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.prisma.assignment.findMany({
      include: {
        person: true,
        track: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  listByPerson(personId: string) {
    return this.prisma.assignment.findMany({
      where: { personId },
      include: { track: true },
    })
  }

  async createIfNotExists(data: {
    personId: string
    trackId: string
  }) {
    const exists = await this.prisma.assignment.findUnique({
      where: {
        personId_trackId: {
          personId: data.personId,
          trackId: data.trackId,
        },
      },
    })

    if (exists) return exists

    const assignment = await this.prisma.assignment.create({
      data: {
        personId: data.personId,
        trackId: data.trackId,
        progress: 0,
        risk: RiskLevel.LOW,
      },
    })

    // ✅ AUDITORIA REAL
    await this.audit.log({
      personId: assignment.personId,
      action: 'ASSIGNMENT_CREATED',
      context: `Trilha atribuída`,
    })

    return assignment
  }

  async updateProgress(
    id: string,
    progress: number,
    risk: RiskLevel,
  ) {
    const assignment = await this.prisma.assignment.update({
      where: { id },
      data: {
        progress,
        risk,
      },
    })

    // ✅ AUDITORIA REAL
    await this.audit.log({
      personId: assignment.personId,
      action: 'ASSIGNMENT_UPDATED',
      context: `Progresso: ${progress}% · Risco: ${risk}`,
    })

    return assignment
  }
}
