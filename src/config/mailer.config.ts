import type { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export const getMailerConfig = async (
	configService: ConfigService
): Promise<MailerOptions> => ({
	transport: {
		host: configService.get('MAIL_HOST'),
		port: configService.get('MAIL_PORT'),
		secure: false,
		auth: {
			user: configService.get('MAIL_LOGIN'),
			pass: configService.get('MAIL_PASSWORD')
		}
	},
	defaults: {
		from: `"TeaCoder Team" ${configService.get('MAIL_LOGIN')}`
	}
})
