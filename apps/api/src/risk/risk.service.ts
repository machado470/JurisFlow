import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

const RISK_ORDER: RiskLevel[] = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]

@Injectable()
export class RiskService {
  constructor(private readonly prisma: PrismaService) {}

  async listPeopleRisk(orgId: string) {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        person: {
          is: {
            orgId,
            active: true,
          },
        },
      },
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

      const educationalRisk = this.calculateEducationalRisk({
        progress: a.progress,
        averageScore: avgScore,
      })

      const operationalRisk =
        this.calculateOperationalRiskFromScore(
          a.person.riskScore,
        )

      const finalRisk = this.resolveFinalRisk(
        educationalRisk,
        operationalRisk,
      )

      const current = byPerson.get(a.personId)

      if (!current) {
        byPerson.set(a.personId, {
          personId: a.personId,
          name: a.person.name,
          email: a.person.email,
          risk: finalRisk,
          progress: a.progress,
          educationalRisk,
          operationalRisk,
          riskScore: a.person.riskScore,
        })
      } else if (
        RISK_ORDER.indexOf(finalRisk) >
        RISK_ORDER.indexOf(current.risk)
      ) {
        current.risk = finalRisk
        current.educationalRisk = educationalRisk
        current.operationalRisk = operationalRisk
        current.riskScore = a.person.riskScore
      }
    }

    return Array.from(byPerson.values())
  }

  async recalculatePersonRisk(personId: string) {
    const events = await this.prisma.event.findMany({
      where: { personId },
    })

    let score = 0

    for (const e of events) {
      if (e.type === 'CORRECTIVE_ACTION_CREATED') score += 20
      if (e.type === 'CORRECTIVE_ACTION_RESOLVED') score -= 20
    }

    score = Math.max(0, Math.min(100, score))

    await this.prisma.person.update({
      where: { id: personId },
      data: { riskScore: score },
    })

    return score
  }

  private resolveFinalRisk(
    educational: RiskLevel,
    operational: RiskLevel,
  ): RiskLevel {
    return RISK_ORDER.indexOf(educational) >=
      RISK_ORDER.indexOf(operational)
      ? educational
      : operational
  }

  private calculateOperationalRiskFromScore(
    score: number,
  ): RiskLevel {
    if (score >= 60) return 'CRITICAL'
    if (score >= 40) return 'HIGH'
    if (score >= 20) return 'MEDIUM'
    return 'LOW'
  }

  private calculateEducationalRisk(params: {
    progress: number
    averageScore?: number
  }): RiskLevel {
    const { progress, averageScore } = params

    if (progress < 30) return 'CRITICAL'
    if (progress < 60) return 'HIGH'

    if (averageScore !== undefined) {
      if (averageScore < 50) return 'HIGH'
      if (averageScore < 70) return 'MEDIUM'
    }

    return 'LOW'
  }
}
