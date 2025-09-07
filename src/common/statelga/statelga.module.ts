import { Module } from '@nestjs/common';
import { StatelgaController } from './statelga.controller';
import { StatelgaService } from './statelga.service';

@Module({
  controllers: [StatelgaController],
  providers: [StatelgaService]
})
export class StatelgaModule {}
