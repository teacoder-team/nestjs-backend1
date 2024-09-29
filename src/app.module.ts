import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { PasswordRecoveryModule } from './auth/password-recovery/password-recovery.module'
import { ChapterModule } from './chapter/chapter.module'
import { CourseModule } from './course/course.module'
import { IS_DEV_ENV } from './libs/common/utils/is-dev.util'
import { MailModule } from './libs/mail/mail.module'
import { TelegramModule } from './libs/telegram/telegram.module'
import { YoutubeModule } from './libs/youtube/youtube.module'
import { MediaModule } from './media/media.module'
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
		PasswordRecoveryModule,
		UserModule,
		MailModule,
		CourseModule,
		ChapterModule,
		ProgressModule,
		YoutubeModule,
		MediaModule,
		TelegramModule
	]
})
export class AppModule {}
