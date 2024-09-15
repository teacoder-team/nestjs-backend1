import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { ChapterModule } from './chapter/chapter.module'
import { CourseModule } from './course/course.module'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { MailModule } from './libs/mail/mail.module'
import { PrismaModule } from './prisma/prisma.module'
import { ProgressModule } from './progress/progress.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true
		}),
		PrismaModule,
		AuthModule,
		UserModule,
		MailModule,
		CourseModule,
		ChapterModule,
		ProgressModule
	]
})
export class AppModule {}
