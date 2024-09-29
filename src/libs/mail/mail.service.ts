import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from '@react-email/components'

import { ResetPasswordTemplate } from './templates/reset-password.template'
import { WelcomeTemplate } from './templates/welcome.template'

@Injectable()
export class MailService {
	constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	/**
	 * Отправляет приветственное письмо при успешной регистрации пользователя.
	 *
	 * @param email - Адрес получателя приветственного письма.
	 * @param username - Имя пользователя, которое будет отображаться в письме.
	 * @returns Promise, которое разрешается после завершения отправки приветственного письма.
	 */
	public async sendWelcomeEmail(email: string, username: string) {
		const html = render(WelcomeTemplate({ username }))

		return this.sendMail(email, 'Успешная регистрация', html)
	}

	public async sendPasswordResetEmail(email: string, token: string) {
		const url = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')
		const html = await render(ResetPasswordTemplate({ url, token }))

		return this.sendMail(email, 'Сброс пароля', html)
	}

	/**
	 * Отправляет электронное письмо с указанными параметрами.
	 *
	 * @param email - Адрес получателя письма.
	 * @param subject - Тема письма.
	 * @param html - HTML-содержимое письма, которое будет отправлено.
	 * @returns Promise, которое разрешается после завершения отправки письма.
	 */
	private sendMail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
