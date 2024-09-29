import { Module } from '@nestjs/common'

import { UserService } from '@/user/user.service'

import { CourseController } from './course.controller'
import { CourseService } from './course.service'

@Module({
	controllers: [CourseController],
	providers: [CourseService, UserService]
})
export class CourseModule {}
