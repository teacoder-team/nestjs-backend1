import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common'

import { YoutubeService } from './youtube.service'

@Controller('youtube')
export class YoutubeController {
	constructor(private readonly youtubeService: YoutubeService) {}

	@Get(':channel')
	@HttpCode(HttpStatus.OK)
	public async parseLastVideo(@Param('channel') channel: string) {
		return this.youtubeService.parseLastVideo(channel)
	}
}
