import { Inject, Injectable, type OnModuleInit } from '@nestjs/common'

import { ProvidersOptionsSymbol, type TypeOptions } from './provider.constants'
import { BaseOAuthService } from './services/base-oauth.service'

@Injectable()
export class ProviderService implements OnModuleInit {
	public constructor(
		@Inject(ProvidersOptionsSymbol) private readonly options: TypeOptions
	) {}

	public onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	public findByService(service: string): BaseOAuthService | null {
		return this.options.services.find(s => s.name === service) ?? null
	}
}
