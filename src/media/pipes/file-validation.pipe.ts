import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

const allowedMimeTypes = [
	'image/jpeg',
	'image/png',
	'image/gif',
	'application/zip',
	'text/plain',
	'image/svg+html'
]

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15 МБ для всех файлов кроме zip
const MAX_ZIP_FILE_SIZE = 200 * 1024 * 1024 // 100 МБ для zip файлов

@Injectable()
export class FileValidationPipe implements PipeTransform {
	transform(value: any) {
		const files = Array.isArray(value) ? value : [value]

		for (const file of files) {
			if (!file || !file.mimetype)
				throw new BadRequestException('Файл не указаан')

			if (!allowedMimeTypes.includes(file.mimetype))
				throw new BadRequestException('Тип файла не поддерживается')

			const maxSize =
				file.mimetype === 'application/zip'
					? MAX_ZIP_FILE_SIZE
					: MAX_FILE_SIZE

			if (file.size > maxSize)
				throw new BadRequestException('Размер файла слишком большой')
		}

		return value
	}
}
