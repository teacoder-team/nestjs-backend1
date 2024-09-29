import { Module } from '@nestjs/common'
import { ChapterModule } from 'src/chapter/chapter.module'

import { UserService } from '@/user/user.service'

import { ProgressController } from './progress.controller'
import { ProgressService } from './progress.service'

@Module({
	imports: [ChapterModule],
	controllers: [ProgressController],
	providers: [ProgressService, UserService]
})
export class ProgressModule {}
