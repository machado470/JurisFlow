import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common'
import { PersonsService } from './persons.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('persons')
@UseGuards(JwtAuthGuard)
export class PersonsController {
  constructor(private readonly persons: PersonsService) {}

  @Get()
  list(@Req() req: any) {
    return this.persons.list(req.user.orgId)
  }

  @Get(':id')
  get(@Req() req: any, @Param('id') id: string) {
    return this.persons.getById(id, req.user.orgId)
  }

  @Post()
  create(
    @Req() req: any,
    @Body()
    data: {
      name: string
      email: string
      role: 'ADMIN' | 'COLLABORATOR'
    },
  ) {
    return this.persons.create({
      ...data,
      orgId: req.user.orgId,
    })
  }

  @Patch(':id/toggle')
  toggle(@Req() req: any, @Param('id') id: string) {
    return this.persons.toggleActive(id, req.user.orgId)
  }
}
