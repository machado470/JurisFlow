import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PeopleService } from './people.service'

@Controller('people')
@UseGuards(JwtAuthGuard)
export class PeopleController {
  constructor(
    private readonly peopleService: PeopleService,
  ) {}

  @Get()
  async list() {
    return this.peopleService.findAll()
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.peopleService.findById(id)
  }

  /**
   * 🔁 FÉRIAS / AFASTAMENTO
   */
  @Post(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.peopleService.deactivate(
      id,
      body?.reason,
    )
  }

  /**
   * 🔁 RETORNO
   */
  @Post(':id/activate')
  async activate(@Param('id') id: string) {
    return this.peopleService.activate(id)
  }

  /**
   * ⛔ DESLIGAMENTO DEFINITIVO
   */
  @Post(':id/offboard')
  async offboard(
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.peopleService.offboard(
      id,
      body?.reason,
    )
  }
}
