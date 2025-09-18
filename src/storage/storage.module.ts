import { DynamicModule, Module } from '@nestjs/common';
import { GcsStorageProvider } from './providers/gcs-storage.provider';

export type StorageProviderType = 'gcs' | 's3' | 'local';

@Module({
  providers: [GcsStorageProvider],
})
export class StorageModule {
  static register(provider: StorageProviderType): DynamicModule {
    let providerClass: typeof GcsStorageProvider | any;

    switch (provider) {
      case 'gcs':
        providerClass = GcsStorageProvider;
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
