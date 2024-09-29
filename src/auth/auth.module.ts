import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MailService } from 'src/libs/mail/mail.service'
import { UserService } from 'src/user/user.service'

import { getProvidersConfig } from '@/config/providers.config'
import { TelegramService } from '@/libs/telegram/telegram.service'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthProviderGuard } from './guards/provider.guard'
import { ProviderModule } from './providers/provider.module'

@Module({
	imports: [
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getProvidersConfig,
			inject: [ConfigService]
		})
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		AuthProviderGuard,
		UserService,
		MailService,
		TelegramService
	],
	exports: [AuthService]
})
export class AuthModule {}
