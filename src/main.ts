import { type INestApplication, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import RedisStore from 'connect-redis'
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session'
import helmet from 'helmet'
import IORedis from 'ioredis'

import { AppModule } from './app.module'
import { ms, type StringValue } from './libs/common/utils/ms.util'
import { parseBoolean } from './libs/common/utils/parse-boolean.util'

function createSwagger(prefix: string, app: INestApplication) {
	const options = new DocumentBuilder()
		.setTitle('TeaCoder API')
		.setDescription(
			'This project is a backend for the Teacoder educational platform focused on teaching web development. It is developed using modern technologies to ensure high performance, scalability, and ease of use.'
		)
		.setContact('TeaCoder Team', 'https://teacoder.ru', 'help@teacoder.ru')
		.addBearerAuth()
		.build()

	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup(prefix, app, document)
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const config = app.get(ConfigService)
	const redis = new IORedis(config.getOrThrow('REDIS_URI'))

	app.use(helmet())
	app.use(cookieParser(config.getOrThrow('COOKIES_SECRET')))

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	)

	app.use(
		session({
			secret: config.getOrThrow('SESSION_SECRET'),
			name: config.getOrThrow('SESSION_NAME'),
			resave: false,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE')
				),
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER')
			})
		})
	)

	app.enableCors({
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie']
	})

	if (parseBoolean(config.getOrThrow<string>('SWAGGER_ENABLED'))) {
		createSwagger(config.getOrThrow<string>('SWAGGER_PREFIX'), app)
	}

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'))
}
bootstrap()
