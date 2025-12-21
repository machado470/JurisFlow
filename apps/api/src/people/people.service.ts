import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PeopleService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { createdAt: 'desc' },
        },
        correctiveActions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!person) {
      throw new NotFoundException('Pessoa não encontrada')
    }

    return person
  }
}
