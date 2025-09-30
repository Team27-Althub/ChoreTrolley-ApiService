import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import type { IStorageService } from '../../storage/interfaces/storage.interface';

@Injectable()
export class StorageMiddleware implements NestMiddleware {
  constructor(
    @Inject('IStorageService') private readonly storageService: IStorageService,
  ) {}

  use(req: any, res: any, next: () => void) {
    req.storageService = this.storageService;
    next();
  }
}
