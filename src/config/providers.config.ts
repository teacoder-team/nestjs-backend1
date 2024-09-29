import { ConfigService } from '@nestjs/config'
import { GoogleProvider } from 'src/auth/providers/services/google.provider'
import { YandexProvider } from 'src/auth/providers/services/yandex.provider'

import type { TypeOptions } from '@/auth/providers/provider.constants'
import { GithubProvider } from '@/auth/providers/services/github.provider'

export const getProvidersConfig = async (
	configService: ConfigService
): Promise<TypeOptions> => ({
	baseUrl: configService.getOrThrow<string>('APPLICATION_URL')!,
	services: [
		new GoogleProvider({
			client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>(
				'GOOGLE_CLIENT_SECRET'
			),
			scopes: ['email', 'profile']
		}),
		new GithubProvider({
			client_id: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>(
				'GITHUB_CLIENT_SECRET'
			),
			scopes: ['user:email']
		}),
		new YandexProvider({
			client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
			client_secret: configService.getOrThrow<string>(
				'YANDEX_CLIENT_SECRET'
			),
			scopes: ['login:email', 'login:avatar', 'login:info']
		})
	]
})
