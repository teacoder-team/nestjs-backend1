import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	UploadedFiles,
	UseInterceptors,
	UsePipes
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { UserRole } from '@prisma/__generated__'

import { Authorization } from '@/auth/decorators/auth.decorator'

import type { File } from './interfaces/media.interface'
import { MediaService } from './media.service'
import { FileValidationPipe } from './pipes/file-validation.pipe'
import { FolderValidationPipe } from './pipes/folder-validation.pipe'

@Controller('media')
export class MediaController {
	public constructor(private readonly mediaService: MediaService) {}

	@UsePipes(new FolderValidationPipe())
	@UseInterceptors(FilesInterceptor('media'))
	@Authorization(UserRole.ADMIN)
	@Post()
	@HttpCode(HttpStatus.OK)
	public async uploadMediaFile(
		@UploadedFiles(FileValidationPipe) mediaFiles: File | File[],
		@Query('folder') folder?: string
	) {
		return this.mediaService.saveMedia(mediaFiles, folder)
	}
}
