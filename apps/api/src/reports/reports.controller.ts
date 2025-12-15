import { Controller, Get, Query } from '@nestjs/common'
import { RiskService } from '../risk/risk.service'
import { AssignmentsService } from '../assignments/assignments.service'
import { AuditService } from '../audit/audit.service'
import { Public } from '../auth/decorators/public.decorator'

@Public()
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly risk: RiskService,
    private readonly assignments: AssignmentsService,
    private readonly audit: AuditService,
  ) {}

  @Get('executive')
  executive(@Query('orgId') orgId: string) {
    const people = this.risk.listPeopleRisk(orgId)
    const actions = this.assignments.list(orgId)
    const logs = this.audit.list().slice(-10)

    return {
      summary: {
        totalPeople: people.length,
        critical: people.filter(p => p.risk === 'CRÍTICO').length,
        attention: people.filter(p => p.risk === 'ATENÇÃO').length,
        ok: people.filter(p => p.risk === 'OK').length,
      },
      peopleAtRisk: people.filter(p => p.risk !== 'OK'),
      actions,
      audit: logs,
      generatedAt: new Date(),
    }
  }
}
