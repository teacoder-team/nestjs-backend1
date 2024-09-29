import { Module } from '@nestjs/common'

import { YoutubeController } from './youtube.controller'
import { YoutubeService } from './youtube.service'

@Module({
	controllers: [YoutubeController],
	providers: [YoutubeService]
})
export class YoutubeModule {}
