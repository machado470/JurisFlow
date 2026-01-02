import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PersonsService } from './persons.service'

@Controller('persons')
@UseGuards(JwtAuthGuard)
export class PersonsController {
  constructor(private readonly persons: PersonsService) {}

  // 🔹 LISTAR PESSOAS ATIVAS
  @Get()
  async list() {
    return this.persons.listActive()
  }

  // 🔹 BUSCAR PESSOA COM CONTEXTO
  @Get(':id')
  async get(@Param('id') id: string) {
    return this.persons.findWithContext(id)
  }

  // 🔹 VINCULAR PERSON AO USUÁRIO LOGADO
  @Post('link')
  async link(
    @Req() req: any,
    @Body()
    body: {
      personId: string
    },
  ) {
    return this.persons.linkPersonToUser({
      userId: req.user.sub,
      personId: body.personId,
    })
  }

  // 🔹 MÉTRICA BÁSICA
  @Get('metrics/count-with-user')
  async countWithUser() {
    return this.persons.countUsersWithPerson()
  }
}
