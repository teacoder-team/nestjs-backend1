import { Injectable } from '@nestjs/common'
import { UserProgress } from '@prisma/__generated__'
import { ChapterService } from 'src/chapter/chapter.service'

import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class ProgressService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly chapterService: ChapterService
	) {}

	public async newProgress(
		userId: string,
		chapterId: string,
		isCompleted: boolean
	) {
		const currentChapter = await this.chapterService.findById(chapterId)

		const existingProgress =
			await this.prismaService.userProgress.findUnique({
				where: {
					userId_chapterId: {
						userId,
						chapterId
					}
				}
			})

		let userProgress: UserProgress

		if (existingProgress) {
			const wasCompleted = existingProgress.isCompleted

			userProgress = await this.prismaService.userProgress.update({
				where: {
					userId_chapterId: {
						userId,
						chapterId
					}
				},
				data: { isCompleted }
			})

			if (!wasCompleted && isCompleted) {
				await this.prismaService.user.update({
					where: {
						id: userId
					},
					data: {
						points: {
							increment: 5
						}
					}
				})
			} else if (wasCompleted && !isCompleted) {
				await this.prismaService.user.update({
					where: {
						id: userId
					},
					data: {
						points: {
							decrement: 5
						}
					}
				})
			}
		} else {
			userProgress = await this.prismaService.userProgress.create({
				data: {
					userId,
					chapterId,
					isCompleted
				}
			})

			if (isCompleted) {
				await this.prismaService.user.update({
					where: { id: userId },
					data: {
						points: {
							increment: 5
						}
					}
				})
			}
		}

		const nextChapter = await this.prismaService.chapter.findFirst({
			where: {
				courseId: currentChapter.courseId,
				position: {
					gt: currentChapter.position
				},
				isPublished: true
			},
			orderBy: {
				position: 'asc'
			}
		})

		return {
			userProgress,
			nextChapter
		}
	}
}
