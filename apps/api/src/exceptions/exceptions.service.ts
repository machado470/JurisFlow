import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../audit/audit.service'

@Injectable()
export class ExceptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async create(params: {
    personId: string
    type: 'VACATION' | 'LEAVE' | 'PAUSE'
    reason: string
    startsAt: Date
    endsAt: Date
  }) {
    if (params.endsAt <= params.startsAt) {
      throw new BadRequestException(
        'Período de exceção inválido',
      )
    }

    const created = await this.prisma.personException.create({
      data: params,
    })

    await this.audit.log({
      personId: params.personId,
      action: 'PERSON_EXCEPTION_CREATED',
      context: `${params.type}: ${params.reason}`,
    })

    return created
  }

  async listForPerson(personId: string) {
    return this.prisma.personException.findMany({
      where: { personId },
      orderBy: { startsAt: 'desc' },
    })
  }
}
