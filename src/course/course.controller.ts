import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query
} from '@nestjs/common'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'

import { CourseService } from './course.service'
import { CreateCourseDto } from './dto/create-course.dto'

@Controller('courses')
export class CourseController {
	public constructor(private readonly courseService: CourseService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	public async findAll(@Query('searchTerm') seacrhTerm?: string) {
		return this.courseService.findList(seacrhTerm)
	}

	@Get('by-slug/:slug')
	@HttpCode(HttpStatus.OK)
	public async findBySlug(@Param('slug') slug: string) {
		return this.courseService.findBySlug(slug)
	}

	@Authorization(UserRole.ADMIN)
	@Get('by-id/:id')
	@HttpCode(HttpStatus.OK)
	public async findById(@Param('id') id: string) {
		return this.courseService.findById(id)
	}

	@Authorization(UserRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.OK)
	public async create(@Body() dto: CreateCourseDto) {
		return this.courseService.create(dto)
	}
}
