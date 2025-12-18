import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RiskLevel } from '@prisma/client'
import { AuditService } from '../audit/audit.service'

@Injectable()
export class RiskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  calculateRisk(params: {
    progress: number
    averageScore?: number
  }): RiskLevel {
    const { progress, averageScore } = params

    if (progress < 30) return RiskLevel.CRITICAL
    if (progress < 60) return RiskLevel.HIGH

    if (averageScore !== undefined) {
      if (averageScore < 50) return RiskLevel.HIGH
      if (averageScore < 70) return RiskLevel.MEDIUM
    }

    return RiskLevel.LOW
  }

  /**
   * Lista pessoas com risco agregado a partir das assignments
   */
  async listPeopleRisk() {
    const assignments = await this.prisma.assignment.findMany({
      include: {
        person: true,
        assessments: true,
      },
    })

    const byPerson = new Map<string, any>()

    for (const a of assignments) {
      const avgScore =
        a.assessments.length > 0
          ? Math.round(
              a.assessments.reduce((s, x) => s + x.score, 0) /
                a.assessments.length,
            )
          : undefined

      const risk = this.calculateRisk({
        progress: a.progress,
        averageScore: avgScore,
      })

      const current = byPerson.get(a.personId)

      if (!current) {
        byPerson.set(a.personId, {
          personId: a.personId,
          name: a.person.name,
          email: a.person.email,
          risk,
          progress: a.progress,
          assignments: 1,
        })
      } else {
        current.assignments += 1
        current.progress = Math.round(
          (current.progress + a.progress) / 2,
        )

        // mantém o pior risco
        const order = [
          RiskLevel.LOW,
          RiskLevel.MEDIUM,
          RiskLevel.HIGH,
          RiskLevel.CRITICAL,
        ]
        if (
          order.indexOf(risk) >
          order.indexOf(current.risk)
        ) {
          current.risk = risk
        }
      }
    }

    return Array.from(byPerson.values())
  }
}
