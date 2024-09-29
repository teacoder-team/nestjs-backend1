import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { UserService } from 'src/user/user.service'
import { v4 as uuidv4 } from 'uuid'

import { MailService } from '@/libs/mail/mail.service'

import { NewPasswordDto } from './dto/new-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

@Injectable()
export class PasswordRecoveryService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly userService: UserService,
		private readonly mailService: MailService
	) {}

	public async reset(dto: ResetPasswordDto) {
		const existingUser = await this.userService.findByEmail(dto.email)

		if (!existingUser) {
			throw new NotFoundException('Пользователь не найден')
		}

		const passwordResetToken = await this.generatePasswordResetToken(
			dto.email
		)
		await this.mailService.sendPasswordResetEmail(
			passwordResetToken.email,
			passwordResetToken.token
		)

		return true
	}

	public async newPassword(dto: NewPasswordDto, token: string) {
		const existingToken = await this.prismaService.resetToken.findUnique({
			where: {
				token
			}
		})

		if (!existingToken) {
			throw new NotFoundException('Токен не найден')
		}

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) {
			throw new BadRequestException('Токен истек')
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email
		)

		if (!existingUser) {
			throw new NotFoundException('Пользователь не найден')
		}

		await this.prismaService.user.update({
			where: {
				id: existingUser.id
			},
			data: {
				password: await hash(dto.password)
			}
		})

		await this.prismaService.resetToken.delete({
			where: {
				id: existingToken.id
			}
		})

		return true
	}

	private async generatePasswordResetToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

		const existingToken = await this.prismaService.resetToken.findFirst({
			where: { email }
		})

		if (existingToken) {
			await this.prismaService.resetToken.delete({
				where: { id: existingToken.id }
			})
		}

		const passwordResetToken = await this.prismaService.resetToken.create({
			data: {
				email,
				token,
				expiresIn
			}
		})

		return passwordResetToken
	}
}
