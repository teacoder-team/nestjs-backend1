import { type DynamicModule, Module } from '@nestjs/common'

import {
	ProvidersOptionsSymbol,
	type TypeAsyncOptions,
	type TypeOptions
} from './provider.constants'
import { ProviderService } from './provider.service'

@Module({})
export class ProviderModule {
	public static register(options: TypeOptions): DynamicModule {
		return {
			module: ProviderModule,
			providers: [
				{
					useValue: options.services,
					provide: ProvidersOptionsSymbol
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}

	public static registerAsync(options: TypeAsyncOptions): DynamicModule {
		return {
			module: ProviderModule,
			imports: options.imports,
			providers: [
				{
					useFactory: options.useFactory,
					provide: ProvidersOptionsSymbol,
					inject: options.inject
				},
				ProviderService
			],
			exports: [ProviderService]
		}
	}
}
