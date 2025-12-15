import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

export type AuditEvent = {
  id: string
  entity: string
  entityId: string
  action: string
  meta?: any
  createdAt: Date
}

@Injectable()
export class AuditService {
  private logs: AuditEvent[] = []

  log(
    entity: string,
    entityId: string,
    action: string,
    meta?: any,
  ) {
    const event: AuditEvent = {
      id: randomUUID(),
      entity,
      entityId,
      action,
      meta,
      createdAt: new Date(),
    }

    this.logs.push(event)
    return event
  }

  list() {
    return this.logs
  }
}
