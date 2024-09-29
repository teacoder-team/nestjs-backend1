import { Injectable, UseFilters } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { User } from '@prisma/__generated__'
import { Command, Ctx, Start, Update } from 'nestjs-telegraf'
import { type Scenes, Telegraf } from 'telegraf'

import { TelegrafExceptionFilter } from '../common/filters/telegraf-exception.filter'
import { formatDate } from '../common/utils/format-date.util'

export interface Context extends Scenes.SceneContext {}

@Update()
@Injectable()
@UseFilters(TelegrafExceptionFilter)
export class TelegramService extends Telegraf {
	public constructor(private readonly configService: ConfigService) {
		super(configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'))
	}

	@Start()
	public async onStart(@Ctx() ctx: Context) {
		const message = `
<b>Добро пожаловать в TeaManager!</b>

Этот бот уведомляет вас о новых пользователях на платформе.
`
		await ctx.replyWithHTML(message)
	}

	@Command('info')
	public async onInfo(@Ctx() ctx: Context) {
		const message = `
<b>Что умеет TeaManager?</b>

Он отправляет информацию о зарегистрированных пользователях.
`
		await ctx.replyWithHTML(message)
	}

	public async sendNewUserMessage(user: User, count: number) {
		const message = `
<b>Новый пользователь на сайте</b>

Это уведомление информирует вас о регистрации нового пользователя.

📅 <b>Дата регистрации:</b> ${formatDate(user.createdAt)}
📧 <b>Email:</b> ${user.email}
👤 <b>Имя:</b> ${user.displayName}

👥 <b>Общее количество пользователей:</b> ${count}
`

		await this.telegram.sendMessage(
			this.configService.getOrThrow<string>('TELEGRAM_CHAT_ID'),
			message,
			{
				parse_mode: 'HTML'
			}
		)
	}
}
