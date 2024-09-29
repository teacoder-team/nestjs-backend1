import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { User } from '@prisma/__generated__'

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user

		return data ? user[data] : user
	}
)
