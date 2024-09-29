import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/__generated__'

import { generateSlug } from '@/libs/common/utils/generate-slug.util'
import { PrismaService } from '@/prisma/prisma.service'

import { CreateCourseDto } from './dto/create-course.dto'

@Injectable()
export class CourseService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findList(seacrhTerm?: string) {
		const seacrhTermQuery = seacrhTerm
			? this.findSearchTermFilter(seacrhTerm)
			: {}

		const courses = await this.prismaService.course.findMany({
			where: seacrhTermQuery,
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				chapters: true
			}
		})

		return courses
	}

	public async findBySlug(slug: string) {
		const course = await this.prismaService.course.findUnique({
			where: {
				slug,
				isPublished: true
			},
			include: {
				chapters: {
					orderBy: { position: 'asc' },
					where: { isPublished: true }
				}
			}
		})

		if (!course) throw new NotFoundException('Курс не найден')

		return course
	}

	public async findById(id: string) {
		const course = await this.prismaService.course.findUnique({
			where: {
				id
			},
			include: {
				chapters: {
					orderBy: {
						position: 'asc'
					}
				}
			}
		})

		if (!course) throw new NotFoundException('Курс не найден')

		return course
	}

	public async create(dto: CreateCourseDto) {
		const course = await this.prismaService.course.create({
			data: {
				name: dto.name,
				slug: generateSlug(dto.name)
			}
		})

		return { id: course.id }
	}

	private findSearchTermFilter(searchTerm: string): Prisma.CourseWhereInput {
		return {
			OR: [
				{
					name: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}
	}
}
