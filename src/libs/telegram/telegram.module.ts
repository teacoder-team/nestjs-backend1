import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TelegrafModule } from 'nestjs-telegraf'

import { getTelegrafConfig } from '@/config/telegraf.config'

import { TelegramService } from './telegram.service'

@Module({
	imports: [
		TelegrafModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getTelegrafConfig,
			inject: [ConfigService]
		})
	],
	providers: [TelegramService]
})
export class TelegramModule {}
