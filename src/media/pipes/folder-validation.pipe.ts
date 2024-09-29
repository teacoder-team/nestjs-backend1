import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform
} from '@nestjs/common'

const allowedFolders = ['default', 'users', 'courses', 'repositories', 'email']

@Injectable()
export class FolderValidationPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if (
			metadata.type === 'query' &&
			value &&
			!allowedFolders.includes(value?.toLowerCase())
		)
			throw new BadRequestException(`Невалидное имя для папки: ${value}`)

		return value
	}
}
