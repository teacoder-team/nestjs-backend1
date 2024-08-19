import {
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common'
import {
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import {
	DiscordAuthGuard,
	GithubAuthGuard,
	GoogleAuthGuard,
	YandexAuthGuard
} from './guards/social-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * Обрабатывает запрос на аутентификацию через Google.
	 * Использует GoogleAuthGuard для проверки аутентификации пользователя.
	 * @param req - Объект запроса, содержащий информацию о пользователе
	 */
	@ApiOperation({ summary: 'Google authentication' })
	@ApiOkResponse({
		description: 'Successful response after Google authentication.'
	})
	@Get('google')
	@UseGuards(GoogleAuthGuard)
	async googleAuth(@Req() req) {}

	/**
	 * Обрабатывает обратный вызов после аутентификации через Google.
	 * Проверяет пользователя и добавляет refresh token в ответ.
	 * @param req - Объект запроса, содержащий информацию о пользователе
	 * @param res - Объект ответа Express, используемый для отправки ответа клиенту
	 * @returns Объект с информацией о пользователе, включая access token
	 */
	@ApiOperation({ summary: 'Google authentication callback' })
	@ApiOkResponse({
		description:
			'Successful response containing user information and access token after Google authentication.'
	})
	@ApiUnauthorizedResponse({
		description:
			'Unauthorized access. This endpoint requires Google authentication.'
	})
	@Get('google/callback')
	@UseGuards(GoogleAuthGuard)
	async googleAuthCallback(
		@Req() req,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.validateUser(
			req.user
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return res.redirect(
			`${process.env['APP_ORIGIN']}/student?accessToken=${response.accessToken}`
		)
	}

	/**
	 * Обрабатывает запрос на аутентификацию через Github.
	 * Использует GithubAuthGuard для проверки аутентификации пользователя.
	 * @param req - Объект запроса, содержащий информацию о пользователе
	 */
	@ApiOperation({ summary: 'Github authentication' })
	@ApiOkResponse({
		description: 'Successful response after Github authentication.'
	})
	@Get('github')
	@UseGuards(GithubAuthGuard)
	async githubAuth(@Req() req) {}

	/**
	 * Обрабатывает обратный вызов после аутентификации через Github.
	 * Проверяет пользователя и добавляет refresh token в ответ.
	 * @param req - Объект запроса, содержащий информацию о пользователе
	 * @param res - Объект ответа Express, используемый для отправки ответа клиенту
	 * @returns Объект с информацией о пользователе, включая access token
	 */
	@ApiOperation({ summary: 'Github authentication callback' })
	@ApiOkResponse({
		description:
			'Successful response containing user information and access token after Github authentication.'
	})
	@ApiUnauthorizedResponse({
		description:
			'Unauthorized access. This endpoint requires Github authentication.'
	})
	@Get('github/callback')
	@UseGuards(GithubAuthGuard)
	async githubAuthCallback(
		@Req() req,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.validateUser(
			req.user
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return res.redirect(
			`${process.env['APP_ORIGIN']}/student?accessToken=${response.accessToken}`
		)
	}

	/**
	 * Обрабатывает запрос на аутентификацию через Yandex.
	 * Использует YandexAuthGuard для проверки аутентификации пользователя.
	 * @param _req - Объект запроса, содержащий информацию о пользователе
	 */
	@ApiOperation({ summary: 'Yandex authentication' })
	@ApiOkResponse({
		description: 'Successful response after Yandex authentication.'
	})
	@Get('yandex')
	@UseGuards(YandexAuthGuard)
	async yandexAuth(@Req() _req) {}

	/**
	 * Обрабатывает обратный вызов после аутентификации через Yandex.
	 * Проверяет пользователя и добавляет refresh token в ответ.
	 * @param req - Объект запроса, содержащий информацию о пользователе
	 * @param res - Объект ответа Express, используемый для отправки ответа клиенту
	 * @returns Объект с информацией о пользователе, включая access token
	 */
	@ApiOperation({ summary: 'Yandex authentication callback' })
	@ApiOkResponse({
		description:
			'Successful response containing user information and access token after Yandex authentication.'
	})
	@ApiUnauthorizedResponse({
		description:
			'Unauthorized access. This endpoint requires Yandex authentication.'
	})
	@Get('yandex/callback')
	@UseGuards(YandexAuthGuard)
	async yandexAuthCallback(
		@Req() req,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.validateUser(
			req.user
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		console.log(response, refreshToken)

		return res.redirect(
			`${process.env['APP_ORIGIN']}/student?accessToken=${response.accessToken}`
		)
	}

	/**
	 * Обрабатывает запрос на аутентификацию через Discord.
	 * Использует DiscordAuthGuard для проверки аутентификации пользователя.
	 * @param req - Объект запроса, содержащий информацию о пользователе
	 */
	@ApiOperation({ summary: 'Discord authentication' })
	@ApiOkResponse({
		description: 'Successful response after Discord authentication.'
	})
	@Get('discord')
	@UseGuards(DiscordAuthGuard)
	async discordAuth(@Req() req) {}

	/**
	 * Обрабатывает обратный вызов после аутентификации через Discord.
	 * Проверяет пользователя и добавляет refresh token в ответ.
	 * @param req - Объект запроса, содержащий информацию о пользователе
	 * @param res - Объект ответа Express, используемый для отправки ответа клиенту
	 * @returns Объект с информацией о пользователе, включая access token
	 */
	@ApiOperation({ summary: 'Discord authentication callback' })
	@ApiOkResponse({
		description:
			'Successful response containing user information and access token after Discord authentication.'
	})
	@ApiUnauthorizedResponse({
		description:
			'Unauthorized access. This endpoint requires Discord authentication.'
	})
	@Get('discord/callback')
	@UseGuards(DiscordAuthGuard)
	async discordAuthCallback(
		@Req() req,
		@Res({ passthrough: true }) res: Response
	) {
		const { refreshToken, ...response } = await this.authService.validateUser(
			req.user
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return res.redirect(
			`${process.env['APP_ORIGIN']}/student?accessToken=${response.accessToken}`
		)
	}

	/**
	 * Получает новые access и refresh токены на основе refresh токена из cookies.
	 * Если токен валиден, генерирует новые токены и добавляет refresh токен в ответ.
	 * @param req - Объект запроса.
	 * @param res - Объект ответа Express.
	 * @returns Объект с новыми токенами.
	 * @throws UnauthorizedException - Если refresh токен отсутствует или недействителен.
	 */
	@ApiOperation({ summary: 'Get new tokens' })
	@ApiOkResponse({
		description: 'Successful response containing new access and refresh tokens.'
	})
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshTokenFromCookies =
			req.cookies[this.authService.REFRESH_TOKEN_NAME]

		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Refresh токен не прошёл')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(
			refreshTokenFromCookies
		)

		this.authService.addRefreshTokenToResponse(res, refreshToken)

		return response
	}

	/**
	 * Обрабатывает запрос на выход из системы.
	 * Удаляет refresh token из ответа, очищая cookie.
	 * @param res - Объект ответа Express
	 * @returns true - Успешный ответ о выходе из системы
	 */
	@ApiOperation({ summary: 'Logout' })
	@ApiOkResponse({
		description: 'Successful response after logout.'
	})
	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshTokenFromResponse(res)
		return true
	}
}
