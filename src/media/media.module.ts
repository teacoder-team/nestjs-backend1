import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'

import { UserService } from '@/user/user.service'

import { MediaController } from './media.controller'
import { MediaService } from './media.service'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		})
	],
	controllers: [MediaController, UserService],
	providers: [MediaService]
})
export class MediaModule {}
