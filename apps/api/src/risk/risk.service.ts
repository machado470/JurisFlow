import { Injectable } from '@nestjs/common'
import { PeopleService } from '../people/people.service'
import { AssignmentsService } from '../assignments/assignments.service'
import { ProgressService } from '../progress/progress.service'

type RiskLevel = 'OK' | 'ATENÇÃO' | 'CRÍTICO'

@Injectable()
export class RiskService {
  constructor(
    private readonly people: PeopleService,
    private readonly assignments: AssignmentsService,
    private readonly progress: ProgressService,
  ) {}

  private calcRisk(assignments: any[]): RiskLevel {
    const mandatory = assignments.filter(a => a.mandatory)

    if (mandatory.length === 0) return 'OK'

    const incomplete = mandatory.filter(a => a.progress < 100)

    if (incomplete.length === 0) return 'OK'
    if (incomplete.length <= 2) return 'ATENÇÃO'

    return 'CRÍTICO'
  }

  listPeopleRisk(orgId: string) {
    const people = this.people.list(orgId)

    return people.map(p => {
      const assigns = this.assignments.listByPerson(orgId, p.id)

      const enriched = assigns.map(a => ({
        ...a,
        progress: this.progress.get(
          orgId,
          p.id,
          a.trackId,
        ),
      }))

      return {
        personId: p.id,
        name: p.name,
        role: p.role,
        risk: this.calcRisk(enriched),
        incompleteMandatory: enriched.filter(
          a => a.mandatory && a.progress < 100,
        ).length,
      }
    })
  }
}
