import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common'

export const Org = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()

    // Endpoint público (sem JWT)
    if (!request.user) {
      return null
    }

    return request.user.orgId ?? null
  },
)
