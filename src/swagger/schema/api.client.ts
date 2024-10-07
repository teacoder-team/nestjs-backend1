/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type RegisterDto = object

export type LoginDto = object

export type ResetPasswordDto = object

export type NewPasswordDto = object

export type CreateCourseDto = object

export type CreateChapterDto = object

export type NewProgressDto = object

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean
	/** request path */
	path: string
	/** content type of request body */
	type?: ContentType
	/** query params */
	query?: QueryParamsType
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseFormat
	/** request body */
	body?: unknown
	/** base url */
	baseUrl?: string
	/** request cancellation token */
	cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
	baseUrl?: string
	baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
	securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void
	customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
	data: D
	error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
	public baseUrl: string = ''
	private securityData: SecurityDataType | null = null
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
	private abortControllers = new Map<CancelToken, AbortController>()
	private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

	private baseApiParams: RequestParams = {
		credentials: 'same-origin',
		headers: {},
		redirect: 'follow',
		referrerPolicy: 'no-referrer'
	}

	constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
		Object.assign(this, apiConfig)
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data
	}

	protected encodeQueryParam(key: string, value: any) {
		const encodedKey = encodeURIComponent(key)
		return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
	}

	protected addQueryParam(query: QueryParamsType, key: string) {
		return this.encodeQueryParam(key, query[key])
	}

	protected addArrayQueryParam(query: QueryParamsType, key: string) {
		const value = query[key]
		return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
	}

	protected toQueryString(rawQuery?: QueryParamsType): string {
		const query = rawQuery || {}
		const keys = Object.keys(query).filter(key => 'undefined' !== typeof query[key])
		return keys
			.map(key =>
				Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)
			)
			.join('&')
	}

	protected addQueryParams(rawQuery?: QueryParamsType): string {
		const queryString = this.toQueryString(rawQuery)
		return queryString ? `?${queryString}` : ''
	}

	private contentFormatters: Record<ContentType, (input: any) => any> = {
		[ContentType.Json]: (input: any) =>
			input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
		[ContentType.Text]: (input: any) =>
			input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
		[ContentType.FormData]: (input: any) =>
			Object.keys(input || {}).reduce((formData, key) => {
				const property = input[key]
				formData.append(
					key,
					property instanceof Blob
						? property
						: typeof property === 'object' && property !== null
							? JSON.stringify(property)
							: `${property}`
				)
				return formData
			}, new FormData()),
		[ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
	}

	protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
		return {
			...this.baseApiParams,
			...params1,
			...(params2 || {}),
			headers: {
				...(this.baseApiParams.headers || {}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {})
			}
		}
	}

	protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
		if (this.abortControllers.has(cancelToken)) {
			const abortController = this.abortControllers.get(cancelToken)
			if (abortController) {
				return abortController.signal
			}
			return void 0
		}

		const abortController = new AbortController()
		this.abortControllers.set(cancelToken, abortController)
		return abortController.signal
	}

	public abortRequest = (cancelToken: CancelToken) => {
		const abortController = this.abortControllers.get(cancelToken)

		if (abortController) {
			abortController.abort()
			this.abortControllers.delete(cancelToken)
		}
	}

	public request = async <T = any, E = any>({
		body,
		secure,
		path,
		type,
		query,
		format,
		baseUrl,
		cancelToken,
		...params
	}: FullRequestParams): Promise<HttpResponse<T, E>> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{}
		const requestParams = this.mergeRequestParams(params, secureParams)
		const queryString = query && this.toQueryString(query)
		const payloadFormatter = this.contentFormatters[type || ContentType.Json]
		const responseFormat = format || requestParams.format

		return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
			...requestParams,
			headers: {
				...(requestParams.headers || {}),
				...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
			},
			signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
			body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body)
		}).then(async response => {
			const r = response.clone() as HttpResponse<T, E>
			r.data = null as unknown as T
			r.error = null as unknown as E

			const data = !responseFormat
				? r
				: await response[responseFormat]()
						.then(data => {
							if (r.ok) {
								r.data = data
							} else {
								r.error = data
							}
							return r
						})
						.catch(e => {
							r.error = e
							return r
						})

			if (cancelToken) {
				this.abortControllers.delete(cancelToken)
			}

			if (!response.ok) throw data
			return data
		})
	}
}

/**
 * @title TeaCoder API
 * @version 1.0.0
 * @contact TeaCoder Team <help@teacoder.ru> (https://teacoder.ru)
 *
 * This project is a backend for the Teacoder educational platform focused on teaching web development. It is developed using modern technologies to ensure high performance, scalability, and ease of use.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
	auth = {
		/**
		 * No description
		 *
		 * @name AuthControllerRegister
		 * @request POST:/auth/register
		 */
		authControllerRegister: (data: RegisterDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/auth/register`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @name AuthControllerLogin
		 * @request POST:/auth/login
		 */
		authControllerLogin: (data: LoginDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/auth/login`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @name AuthControllerCallback
		 * @request GET:/auth/oauth/callback/{provider}
		 */
		authControllerCallback: (
			provider: string,
			query: {
				code: string
			},
			params: RequestParams = {}
		) =>
			this.request<void, any>({
				path: `/auth/oauth/callback/${provider}`,
				method: 'GET',
				query: query,
				...params
			}),

		/**
		 * No description
		 *
		 * @name AuthControllerConnect
		 * @request GET:/auth/oauth/connect/{provider}
		 */
		authControllerConnect: (provider: string, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/auth/oauth/connect/${provider}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @name AuthControllerLogout
		 * @request POST:/auth/logout
		 */
		authControllerLogout: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/auth/logout`,
				method: 'POST',
				...params
			}),

		/**
		 * No description
		 *
		 * @name PasswordRecoveryControllerReset
		 * @request POST:/auth/password-recovery/reset
		 */
		passwordRecoveryControllerReset: (data: ResetPasswordDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/auth/password-recovery/reset`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @name PasswordRecoveryControllerNew
		 * @request POST:/auth/password-recovery/new/{token}
		 */
		passwordRecoveryControllerNew: (token: string, data: NewPasswordDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/auth/password-recovery/new/${token}`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			})
	}
	users = {
		/**
		 * No description
		 *
		 * @name UserControllerFindAll
		 * @request GET:/users
		 */
		userControllerFindAll: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/users`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @name UserControllerFindTopUsers
		 * @request GET:/users/find-top
		 */
		userControllerFindTopUsers: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/users/find-top`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @name UserControllerFindById
		 * @request GET:/users/profile
		 */
		userControllerFindById: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/users/profile`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @name UserControllerFindUserProgress
		 * @request GET:/users/progress/{courseId}
		 */
		userControllerFindUserProgress: (courseId: string, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/users/progress/${courseId}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @name UserControllerFindCourseByProgress
		 * @request GET:/users/course-by-progress
		 */
		userControllerFindCourseByProgress: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/users/course-by-progress`,
				method: 'GET',
				...params
			})
	}
	courses = {
		/**
		 * No description
		 *
		 * @name CourseControllerFindAll
		 * @request GET:/courses
		 */
		courseControllerFindAll: (
			query: {
				searchTerm: string
			},
			params: RequestParams = {}
		) =>
			this.request<void, any>({
				path: `/courses`,
				method: 'GET',
				query: query,
				...params
			}),

		/**
		 * No description
		 *
		 * @name CourseControllerCreate
		 * @request POST:/courses
		 */
		courseControllerCreate: (data: CreateCourseDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/courses`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			}),

		/**
		 * No description
		 *
		 * @name CourseControllerFindBySlug
		 * @request GET:/courses/by-slug/{slug}
		 */
		courseControllerFindBySlug: (slug: string, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/courses/by-slug/${slug}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @name CourseControllerFindById
		 * @request GET:/courses/by-id/{id}
		 */
		courseControllerFindById: (id: string, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/courses/by-id/${id}`,
				method: 'GET',
				...params
			})
	}
	chapters = {
		/**
		 * No description
		 *
		 * @name ChapterControllerFindAll
		 * @request GET:/chapters
		 */
		chapterControllerFindAll: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/chapters`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @name ChapterControllerFindBySlug
		 * @request GET:/chapters/by-slug/{slug}
		 */
		chapterControllerFindBySlug: (slug: string, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/chapters/by-slug/${slug}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @name ChapterControllerFindById
		 * @request GET:/chapters/by-id/{id}
		 */
		chapterControllerFindById: (id: string, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/chapters/by-id/${id}`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @name ChapterControllerCreate
		 * @request POST:/chapters/{courseId}
		 */
		chapterControllerCreate: (courseId: string, data: CreateChapterDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/chapters/${courseId}`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				...params
			})
	}
	progress = {
		/**
		 * No description
		 *
		 * @name ProgressControllerNewProgress
		 * @request PUT:/progress/{chapterId}
		 */
		progressControllerNewProgress: (chapterId: string, data: NewProgressDto, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/progress/${chapterId}`,
				method: 'PUT',
				body: data,
				type: ContentType.Json,
				...params
			})
	}
	youtube = {
		/**
		 * No description
		 *
		 * @name YoutubeControllerParseLastVideo
		 * @request GET:/youtube/{channel}
		 */
		youtubeControllerParseLastVideo: (channel: string, params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/youtube/${channel}`,
				method: 'GET',
				...params
			})
	}
	media = {
		/**
		 * No description
		 *
		 * @name MediaControllerUploadMediaFile
		 * @request POST:/media
		 */
		mediaControllerUploadMediaFile: (
			query: {
				folder: string
			},
			params: RequestParams = {}
		) =>
			this.request<void, any>({
				path: `/media`,
				method: 'POST',
				query: query,
				...params
			})
	}
	swagger = {
		/**
		 * No description
		 *
		 * @tags Swagger
		 * @name SwaggerControllerGetJson
		 * @request GET:/swagger/json
		 */
		swaggerControllerGetJson: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/swagger/json`,
				method: 'GET',
				...params
			}),

		/**
		 * No description
		 *
		 * @tags Swagger
		 * @name SwaggerControllerGetTypescript
		 * @request GET:/swagger/typescript
		 */
		swaggerControllerGetTypescript: (params: RequestParams = {}) =>
			this.request<void, any>({
				path: `/swagger/typescript`,
				method: 'GET',
				...params
			})
	}
}
