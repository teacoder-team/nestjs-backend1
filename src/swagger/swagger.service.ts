import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class SwaggerService {
	private readonly swaggerDirectory = path.resolve(
		process.cwd(),
		'./src/swagger/schema'
	)
	private readonly swaggerJsonPath = path.join(
		this.swaggerDirectory,
		'swagger.json'
	)
	private readonly swaggerTypescriptPath = path.join(
		this.swaggerDirectory,
		'api.client.ts'
	)

	public getJson(res: Response): void {
		if (fs.existsSync(this.swaggerJsonPath)) {
			res.download(this.swaggerJsonPath)
		}

		return null
	}

	public getTypescript(res: Response): void {
		if (fs.existsSync(this.swaggerTypescriptPath)) {
			res.download(this.swaggerTypescriptPath)
		}

		return null
	}
}
