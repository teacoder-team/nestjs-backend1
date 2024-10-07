import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Response } from 'express'

import { SwaggerService } from './swagger.service'

@ApiTags('Swagger')
@Controller('swagger')
export class SwaggerController {
	public constructor(private readonly swaggerService: SwaggerService) {}

	@Get('json')
	@HttpCode(HttpStatus.OK)
	public async getJson(@Res() res: Response): Promise<void> {
		return this.swaggerService.getJson(res)
	}

	@Get('typescript')
	@HttpCode(HttpStatus.OK)
	public async getTypescript(@Res() res: Response): Promise<void> {
		return this.swaggerService.getTypescript(res)
	}
}
