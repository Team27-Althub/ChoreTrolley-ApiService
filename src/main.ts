import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    '/uploads',
    express.static(process.env.UPLOAD_PATH || join(process.cwd(), 'uploads')),
  );

  app.use('/order/webhook', express.raw({ type: 'application/json' }));

  /**
   * swagger configuration
   */
  const config = new DocumentBuilder()
    .setTitle('ChoreTrolly Api')
    .setDescription('API Documentation for house chores')
    .setTermsOfService('')
    .setLicense('', '')
    .addServer('http://localhost:3000')
    .addServer('https://choretrolley-apiservice-production.up.railway.app')
    .addBearerAuth()
    .setVersion('0.0.1')
    .build();
  /**
   * Instantiate document
   */
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Enable cors
  app.enableCors();

  //Add global interceptors
  //app.useGlobalInterceptors(new DataResponseInterceptor());
  await app.listen(3000);
}

bootstrap();
