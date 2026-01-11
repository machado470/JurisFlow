import { Injectable } from '@nestjs/common'
import { EnforcementEngineService } from './enforcement-engine.service'

@Injectable()
export class EnforcementJob {
  constructor(private readonly engine: EnforcementEngineService) {}

  async run() {
    return this.engine.runForAllActivePeople()
  }
}
