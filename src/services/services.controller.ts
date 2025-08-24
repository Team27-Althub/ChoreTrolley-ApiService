import { Controller, Get } from '@nestjs/common';
import { ServicesService } from './provider/services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly _services: ServicesService) {}

  @Get('/')
  async getCategories() {
    return this._services.getAllCategories();
  }
}
