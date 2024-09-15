import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()

		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException('Пользователь не авторизован')
		}

		const user = await this.userService.findById(request.session.userId)

		request.user = user

		return true
	}
}
