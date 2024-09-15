import { IsBoolean } from 'class-validator'

export class NewProgressDto {
	@IsBoolean()
	isCompleted: boolean
}
