import { Injectable, NotFoundException } from '@nestjs/common'
import { CourseService } from 'src/course/course.service'
import { v4 as uuidv4 } from 'uuid'

import { generateSlug } from '@/libs/common/utils/generate-slug.util'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateChapterDto } from './dto/create-chapter.dto'

@Injectable()
export class ChapterService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly courseService: CourseService
	) {}

	public async findList() {
		const chapters = await this.prismaService.chapter.findMany({
			where: {
				isPublished: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return chapters
	}

	public async findBySlug(slug: string, userId: string) {
		const chapter = await this.prismaService.chapter.findUnique({
			where: {
				slug,
				isPublished: true
			},
			include: {
				course: {
					include: {
						chapters: {
							where: {
								isPublished: true
							},
							include: {
								userProgress: {
									where: {
										userId
									}
								}
							},
							orderBy: {
								position: 'asc'
							}
						}
					}
				}
			}
		})

		if (!chapter) throw new NotFoundException('Глава не найдена')

		const userProgress = await this.prismaService.userProgress.findFirst({
			where: {
				userId,
				chapterId: chapter.id
			}
		})

		return { chapter, userProgress }
	}

	public async findById(id: string) {
		const chapter = await this.prismaService.chapter.findUnique({
			where: {
				id
			}
		})

		if (!chapter) throw new NotFoundException('Глава не найдена')

		return chapter
	}

	public async create(dto: CreateChapterDto, courseId: string) {
		await this.courseService.findById(courseId)

		const lastChapter = await this.prismaService.chapter.findFirst({
			where: {
				courseId
			},
			orderBy: { position: 'desc' }
		})

		const newPosition = lastChapter ? lastChapter.position + 1 : 1

		const chapter = await this.prismaService.chapter.create({
			data: {
				name: dto.name,
				slug: this.generateSlugWithUniqueSuffix(dto.name),
				position: newPosition,
				courseId
			}
		})

		return { id: chapter.id }
	}

	private generateSlugWithUniqueSuffix(name: string) {
		const slug = generateSlug(name)
		const uniqueSuffix = uuidv4().split('-')[0]

		return `${slug}-${uniqueSuffix}`
	}
}
