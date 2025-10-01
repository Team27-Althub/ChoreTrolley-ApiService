import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const UploadedFileToDto = createParamDecorator(
  async (data: { field: string; dto: any }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const file = request.file;
    const body = request.body;

    let fileUrl: string | null = null;
    if (file && request.storageService) {
      fileUrl = await request.storageService.uploadFile(file);
    }
    const merged = { ...body, [data.field]: fileUrl };
    const dto = plainToInstance(data.dto, merged);

    const errors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return dto;
  },
);

export const UploadedFilesToDto = createParamDecorator(
  async (data: { field: string; dto: any }, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const files = request.files || [];
    const body = request.body;

    let fileUrls: string[] = [];
    if (files?.length && request.storageService) {
      fileUrls = await request.storageService.uploadFiles(files);
    }

    const merged = { ...body, [data.field]: fileUrls };
    const dto = plainToInstance(data.dto, merged);

    const errors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return dto;
  },
);
