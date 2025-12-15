import { Controller, Get } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('admin')
export class AdminController {
  @Roles(Role.ADMIN)
  @Get('dashboard')
  dashboard() {
    return {
      message: 'Bem-vindo ao painel administrativo',
    };
  }
}
