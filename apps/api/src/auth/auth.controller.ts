import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.auth.login(email, password);
  }

  @Public()
  @Post('activate')
  async activate(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.auth.activateAccount(email, password);
  }
}
