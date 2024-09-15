import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCourseDto {
	@IsString({ message: 'Course name must be a string' })
	@IsNotEmpty({ message: 'Course name cannot be empty' })
	name: string
}
