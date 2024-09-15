import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	Put
} from '@nestjs/common'

import { Authorization } from '@/auth/decorators/auth.decorator'
import { Authorized } from '@/auth/decorators/authorized.decorator'

import { NewProgressDto } from './dto/new-progress.dto'
import { ProgressService } from './progress.service'

@Controller('progress')
export class ProgressController {
	public constructor(private readonly progressService: ProgressService) {}

	@Authorization()
	@Put(':chapterId')
	@HttpCode(HttpStatus.OK)
	public async newProgress(
		@Authorized('id') userId: string,
		@Param('chapterId') chapterId: string,
		@Body() dto: NewProgressDto
	) {
		return this.progressService.newProgress(
			userId,
			chapterId,
			dto.isCompleted
		)
	}
}
