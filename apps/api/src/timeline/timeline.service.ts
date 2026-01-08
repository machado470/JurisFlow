import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

type TimelineLogInput = {
  action: string
  personId?: string
}

@Injectable()
export class TimelineService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  /**
   * 📝 Registrar evento humano
   */
  async log(input: TimelineLogInput) {
    return this.prisma.auditEvent.create({
      data: {
        action: input.action,
        person: input.personId
          ? { connect: { id: input.personId } }
          : undefined,
      },
    })
  }

  /**
   * 👤 Timeline por pessoa
   */
  async listByPerson(personId: string) {
    return this.prisma.auditEvent.findMany({
      where: { personId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }

  /**
   * 🌐 Timeline global
   */
  async listGlobal() {
    return this.prisma.auditEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }
}
