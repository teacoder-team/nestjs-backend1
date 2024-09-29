import { Injectable } from '@nestjs/common'
import axios from 'axios'

import { YoutubeResponse } from './interfaces/youtube.interface'

@Injectable()
export class YoutubeService {
	public async parseLastVideo(channel: string): Promise<YoutubeResponse> {
		const { data: result } = await axios.get(
			`https://www.youtube.com/@${channel}/videos`
		)

		const title = this.getString(
			result,
			'"title":{"runs":[{"text":"',
			'"}],"accessibility":'
		)
		const link =
			'https://www.youtube.com/watch?v=' +
			this.getString(
				result,
				'"videoRenderer":{"videoId":"',
				'","thumbnail":'
			)
		const thumbnail = this.getString(
			result,
			'{"thumbnails":[{"url":"',
			'","width"'
		)

		return {
			title,
			link,
			thumbnail
		}
	}

	private getString(initialText: string, start: string, end: string) {
		const from = initialText.indexOf(start)
		const to = initialText.indexOf(end)

		return initialText.substring(from, to).replace(start, '')
	}
}
