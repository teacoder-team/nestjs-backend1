import { Injectable } from '@nestjs/common'
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

		const progress = await this.prismaService.userProgress.upsert({
			where: {
				userId_chapterId: {
					userId,
					chapterId
				}
			},
			update: {
				isCompleted
			},
			create: {
				userId,
				chapterId,
				isCompleted
			}
		})

		const nextChapter = await this.prismaService.chapter.findFirst({
			where: {
				courseId: currentChapter.courseId,
				position: { gt: currentChapter.position },
				isPublished: true
			},
			orderBy: {
				position: 'asc'
			}
		})

		return {
			progress,
			nextChapter
		}
	}
}
