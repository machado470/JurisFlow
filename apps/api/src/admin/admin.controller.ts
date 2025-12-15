import { Controller, Get, Query } from '@nestjs/common'
import { Roles } from '../auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { AdminService } from './admin.service'

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Roles(Role.ADMIN)
  @Get('dashboard')
  dashboard(@Query('orgId') orgId: string) {
    return this.service.getDashboard(orgId)
  }
}
