import { Injectable, NotFoundException } from '@nestjs/common'
import { AuthMethod, Course } from '@prisma/__generated__'
import { hash } from 'argon2'

import { generateSlug } from '@/libs/common/utils/generate-slug.util'
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

	public async findUserProgress(userId: string, courseId: string) {
		const publishedChapters = await this.prismaService.chapter.findMany({
			where: {
				courseId,
				isPublished: true
			}
		})

		const publishedChapterIds = publishedChapters.map(chapter => chapter.id)

		if (publishedChapterIds.length === 0) {
			return 0
		}

		const completedChaptersCount =
			await this.prismaService.userProgress.count({
				where: {
					userId,
					chapterId: {
						in: publishedChapterIds
					},
					isCompleted: true
				}
			})

		const progressPercentage =
			(completedChaptersCount / publishedChapterIds.length) * 100

		return progressPercentage
	}

	public async findCourseByProgress(userId: string) {
		const completedChapters =
			await this.prismaService.userProgress.findMany({
				where: {
					userId,
					isCompleted: true
				},
				select: {
					chapterId: true
				}
			})

		const completedChapterIds = completedChapters.map(
			chapter => chapter.chapterId
		)

		const allCourses = await this.prismaService.course.findMany()

		const coursesInProgress: Course[] = []
		const completedCourses: Course[] = []

		for (const course of allCourses) {
			const courseChapters = await this.prismaService.chapter.findMany({
				where: {
					courseId: course.id
				},
				select: {
					id: true,
					slug: true
				}
			})

			const courseChapterIds = courseChapters.map(chapter => chapter.id)
			const completedCourseChapters = courseChapterIds.filter(id =>
				completedChapterIds.includes(id)
			)

			const progress =
				(completedCourseChapters.length / courseChapterIds.length) * 100

			const courseWithChapters = {
				...course,
				chapters: courseChapters,
				progress: progress
			}

			if (progress === 100) completedCourses.push(courseWithChapters)
			else if (progress > 0) coursesInProgress.push(courseWithChapters)
		}

		return {
			coursesInProgress,
			completedCourses
		}
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
				password: password ? await hash(password) : '',
				displayName,
				username: this.generateUsername(email, displayName),
				picture,
				method
			},
			include: {
				accounts: true
			}
		})

		return user
	}

	private generateUsername(email: string, displayName: string) {
		const emailPart = email.split('@')[0]

		const formattedDisplayName = displayName
			.trim()
			.toLowerCase()
			.replace(/\s+/g, '-')

		const username = `${emailPart}-${formattedDisplayName}`

		return generateSlug(username)
	}
}
