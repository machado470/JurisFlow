import { Injectable } from '@nestjs/common'

@Injectable()
export class AssignmentsService {
  private assignments: any[] = []

  list(orgId: string) {
    return this.assignments.filter(a => a.orgKey === orgId)
  }

  listByPerson(orgId: string, personId: string) {
    return this.assignments.filter(
      a => a.orgKey === orgId && a.personId === personId
    )
  }

  create(data: any) {
    this.assignments.push(data)
    return data
  }
}
