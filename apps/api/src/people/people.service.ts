import { Injectable } from '@nestjs/common'

@Injectable()
export class PeopleService {
  private people: any[] = []

  list(orgId: string) {
    return this.people.filter(p => p.orgKey === orgId)
  }

  create(data: any) {
    this.people.push(data)
    return data
  }
}
