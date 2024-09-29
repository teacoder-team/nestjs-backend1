import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'

import { BaseOAuthService } from './services/base-oauth.service'

export const ProvidersOptionsSymbol = Symbol()

export type TypeOptions = {
	baseUrl: string
	services: BaseOAuthService[]
}

export type TypeAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>
