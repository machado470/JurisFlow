import { Controller, Get } from '@nestjs/common'
import { AuditService } from './audit.service'
import { Public } from '../auth/decorators/public.decorator'

@Public()
@Controller('audit')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list() {
    return this.audit.list()
  }
}
