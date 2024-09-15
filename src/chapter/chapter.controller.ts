import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post
} from '@nestjs/common'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { ChapterService } from './chapter.service'
import { CreateChapterDto } from './dto/create-chapter.dto'

@Controller('chapters')
export class ChapterController {
	public constructor(private readonly chapterService: ChapterService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	public async findAll() {
		return this.chapterService.findList()
	}

	@Authorization()
	@Get('by-slug/:slug')
	@HttpCode(HttpStatus.OK)
	public async findBySlug(
		@Param('slug') slug: string,
		@Authorized('id') userId: string
	) {
		return this.chapterService.findBySlug(slug, userId)
	}

	@Authorization(UserRole.ADMIN)
	@Get('by-id/:id')
	@HttpCode(HttpStatus.OK)
	public async findById(@Param('id') id: string) {
		return this.chapterService.findById(id)
	}

	@Authorization(UserRole.ADMIN)
	@Post(':courseId')
	@HttpCode(HttpStatus.OK)
	public async create(
		@Body() dto: CreateChapterDto,
		@Param('courseId') courseId: string
	) {
		return this.chapterService.create(dto, courseId)
	}
}
