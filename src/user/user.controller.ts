import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { UserService } from './user.service'

@Controller('users')
export class UserController {
	public constructor(private readonly userService: UserService) {}

	@Authorization(UserRole.ADMIN)
	@Get()
	@HttpCode(HttpStatus.OK)
	public async findAll() {
		return this.userService.findList()
	}

	@Get('find-top')
	@HttpCode(HttpStatus.OK)
	public async findTopUsers() {
		return this.userService.findTopUsersByPoints()
	}

	@Authorization()
	@Get('profile')
	@HttpCode(HttpStatus.OK)
	public async findById(@Authorized('id') id: string) {
		return this.userService.findById(id)
	}
}
