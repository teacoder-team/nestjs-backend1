import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as fs from 'fs'
import * as path from 'path'
import { generateApi } from 'swagger-typescript-api'
import * as YAML from 'yaml'

export async function setupSwagger(app: INestApplication): Promise<void> {
	const documentBuilder = new DocumentBuilder()
		.setTitle('TeaCoder API')
		.setDescription(
			'This project is a backend for the Teacoder educational platform focused on teaching web development. It is developed using modern technologies to ensure high performance, scalability, and ease of use.'
		)
		.setContact('TeaCoder Team', 'https://teacoder.ru', 'help@teacoder.ru')

	const document = SwaggerModule.createDocument(app, documentBuilder.build())

	let swaggerStringify = JSON.stringify(document)
	swaggerStringify = swaggerStringify.replace(
		/\"allOf\"\:\[\{(.*?)}\]/gim,
		'$1'
	)

	const swaggerDirectory = path.resolve(process.cwd(), './src/swagger/schema')
	const swaggerJsonPath = path.join(swaggerDirectory, 'swagger.json')
	const swaggerYamlPath = path.join(swaggerDirectory, 'swagger.yaml')

	if (!fs.existsSync(swaggerDirectory)) {
		fs.mkdirSync(swaggerDirectory, { recursive: true })
	}

	fs.writeFileSync(swaggerJsonPath, swaggerStringify)
	fs.writeFileSync(swaggerYamlPath, YAML.stringify(document))

	await generateApi({
		name: 'api.client.ts',
		output: swaggerDirectory,
		input: swaggerYamlPath,
		httpClientType: 'fetch'
	})

	SwaggerModule.setup('swagger', app, document)
}
