import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { AuditService } from '../audit/audit.service'

export type AssignmentStatus = 'PENDING' | 'COMPLETED'

export type Assignment = {
  id: string
  orgKey: string
  personId: string
  trackId?: string
  reason: string
  mandatory: boolean
  status: AssignmentStatus
  createdAt: Date
  completedAt?: Date
}

@Injectable()
export class AssignmentsService {
  private assignments: Assignment[] = []

  constructor(private readonly audit: AuditService) {}

  list(orgId: string) {
    return this.assignments.filter(a => a.orgKey === orgId)
  }

  listByPerson(orgId: string, personId: string) {
    return this.assignments.filter(
      a => a.orgKey === orgId && a.personId === personId,
    )
  }

  createIfNotExists(
    data: Omit<Assignment, 'id' | 'status' | 'createdAt'>,
  ) {
    const exists = this.assignments.find(a =>
      a.orgKey === data.orgKey &&
      a.personId === data.personId &&
      a.reason === data.reason &&
      a.status === 'PENDING',
    )

    if (exists) return exists

    const assignment: Assignment = {
      id: randomUUID(),
      status: 'PENDING',
      createdAt: new Date(),
      ...data,
    }

    this.assignments.push(assignment)

    this.audit.log(
      'assignment',
      assignment.id,
      'CREATED',
      { personId: assignment.personId },
    )

    return assignment
  }

  complete(id: string) {
    const assignment = this.assignments.find(a => a.id === id)

    if (!assignment) {
      throw new Error('Assignment não encontrado')
    }

    assignment.status = 'COMPLETED'
    assignment.completedAt = new Date()

    this.audit.log(
      'assignment',
      assignment.id,
      'COMPLETED',
      { personId: assignment.personId },
    )

    return assignment
  }
}
