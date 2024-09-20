import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'

import { AuthModule } from './auth/auth.module'
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module'
import { ChapterModule } from './chapter/chapter.module'
import { CourseModule } from './course/course.module'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { MailModule } from './libs/mail/mail.module'
import { YoutubeModule } from './libs/youtube/youtube.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProgressModule } from './progress/progress.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		PrismaModule,
		AuthModule,
		PasswordRecoveryModule,
		UserModule,
		MailModule,
		CourseModule,
		ChapterModule,
		ProgressModule,
		YoutubeModule
	]
})
export class AppModule {}
