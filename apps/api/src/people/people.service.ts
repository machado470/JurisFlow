import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AuditService } from '../audit/audit.service'

@Injectable()
export class PeopleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async findAll() {
    return this.prisma.person.findMany({
      include: {
        user: true,
      },
      orderBy: {
        name: 'asc',
      },
    })
  }

  async findById(id: string) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        user: true,
        assignments: {
          include: {
            track: true,
          },
        },
      },
    })

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada')
    }

    return person
  }

  /**
   * 🔁 FÉRIAS / AFASTAMENTO TEMPORÁRIO
   * Não remove histórico.
   * Não apaga usuário.
   * Apenas congela o regime.
   */
  async deactivate(id: string, reason?: string) {
    const person = await this.findById(id)

    if (!person.active) {
      throw new BadRequestException(
        'Pessoa já está inativa',
      )
    }

    await this.prisma.person.update({
      where: { id },
      data: {
        active: false,
      },
    })

    await this.audit.log({
      action: 'PERSON_DEACTIVATED',
      personId: id,
      context:
        reason ??
        'Pessoa marcada como inativa (férias/afastamento)',
    })

    return { success: true }
  }

  /**
   * 🔁 RETORNO DE FÉRIAS / AFASTAMENTO
   */
  async activate(id: string) {
    const person = await this.findById(id)

    if (person.active) {
      throw new BadRequestException(
        'Pessoa já está ativa',
      )
    }

    if (person.offboardedAt) {
      throw new BadRequestException(
        'Pessoa desligada não pode ser reativada',
      )
    }

    await this.prisma.person.update({
      where: { id },
      data: {
        active: true,
      },
    })

    await this.audit.log({
      action: 'PERSON_REACTIVATED',
      personId: id,
      context: 'Pessoa reativada após afastamento',
    })

    return { success: true }
  }

  /**
   * ⛔ DESLIGAMENTO DEFINITIVO
   */
  async offboard(id: string, reason?: string) {
    const person = await this.findById(id)

    if (person.offboardedAt) {
      throw new BadRequestException(
        'Pessoa já está desligada',
      )
    }

    await this.prisma.person.update({
      where: { id },
      data: {
        active: false,
        offboardedAt: new Date(),
      },
    })

    await this.audit.log({
      action: 'PERSON_OFFBOARDED',
      personId: id,
      context:
        reason ??
        'Pessoa desligada do sistema',
    })

    return { success: true }
  }
}
