import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'
import { v4 as uuidv4 } from 'uuid'

import { cleanFileName } from './clean-name'
import type { File, MediaResponse } from './interfaces/media.interface'

@Injectable()
export class MediaService {
	async saveMedia(
		mediaFiles: File | File[],
		folder = 'default'
	): Promise<MediaResponse[]> {
		const folderLowerCase = folder.toLowerCase()

		const uploadFolder = `${path}/uploads/${folderLowerCase}`
		await ensureDir(uploadFolder)

		const responses: MediaResponse[] = []

		for (const file of Array.isArray(mediaFiles)
			? mediaFiles
			: [mediaFiles]) {
			let fileName = file?.originalname || file?.name
			fileName = cleanFileName(fileName)

			const uniqueSuffix = uuidv4().split('-')[0]
			const uniqueFileName = `${uniqueSuffix}-${fileName}`

			await writeFile(`${uploadFolder}/${uniqueFileName}`, file.buffer)

			responses.push({
				url: `/uploads/${folderLowerCase}/${uniqueFileName}`,
				name: uniqueFileName
			})
		}

		return responses
	}
}
