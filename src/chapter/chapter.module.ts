import { Module } from '@nestjs/common'
import { CourseService } from 'src/course/course.service'

import { UserService } from '@/user/user.service'

import { ChapterController } from './chapter.controller'
import { ChapterService } from './chapter.service'

@Module({
	controllers: [ChapterController],
	providers: [ChapterService, UserService, CourseService],
	exports: [ChapterService]
})
export class ChapterModule {}
