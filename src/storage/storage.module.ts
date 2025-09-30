import { DynamicModule, Module } from '@nestjs/common';
import { GcsStorageProvider } from './providers/gcs-storage.provider';
import { LocalStorageProvider } from './providers/local-storage.provider';

export type StorageProviderType = 'gcs' | 's3' | 'local';

@Module({
  providers: [LocalStorageProvider],
})
export class StorageModule {
  static register(provider: StorageProviderType): DynamicModule {
    let providerClass: typeof GcsStorageProvider | any;

    switch (provider) {
      case 'gcs':
        providerClass = GcsStorageProvider;
        break;
      case 'local':
        providerClass = LocalStorageProvider;
        break;
      default:
        throw new Error(`Unsupported storage provider: ${provider}`);
    }

    return {
      module: StorageModule,
      providers: [
        {
          provide: 'IStorageService',
          useClass: providerClass,
        },
      ],
      exports: ['IStorageService'],
    };
  }
}
