import { ConfigService } from '@nestjs/config'
import type { TelegrafModuleOptions } from 'nestjs-telegraf'

export const getTelegrafConfig = async (
	configService: ConfigService
): Promise<TelegrafModuleOptions> => ({
	token: configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN')
})
