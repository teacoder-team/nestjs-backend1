import { Injectable, NotFoundException } from '@nestjs/common'
import { AuthMethod } from '@prisma/__generated__'
import { hash } from 'argon2'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findList() {
		const users = await this.prismaService.user.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				accounts: true
			}
		})

		return users
	}

	public async findTopUsersByPoints() {
		const topUsers = await this.prismaService.user.findMany({
			select: {
				id: true,
				displayName: true,
				picture: true,
				points: true
			},
			orderBy: { points: 'desc' },
			take: 10
		})

		return topUsers
	}

	public async findById(id: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id
			},
			include: {
				accounts: true
			}
		})

		if (!user) throw new NotFoundException('Пользователь не найден')

		return user
	}

	public async findByEmail(email: string) {
		const user = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		return user
	}

	public async create(
		email: string,
		password: string,
		displayName: string,
		picture: string,
		method: AuthMethod
	) {
		const user = await this.prismaService.user.create({
			data: {
				email,
				password: password ? await hash(password) : null,
				displayName,
				username: 'username',
				picture,
				method
			},
			include: {
				accounts: true
			}
		})

		return user
	}
}
