import { IsNotEmpty, IsString } from 'class-validator'

export class CreateChapterDto {
	@IsString({ message: 'Название главы должно быть строкой' })
	@IsNotEmpty({ message: 'Название главы не может быть пустым' })
	name: string
}
