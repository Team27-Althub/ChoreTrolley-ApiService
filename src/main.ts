import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * swagger configuration
   */
  const config = new DocumentBuilder()
    .setTitle('ChoreTrolly Api')
    .setDescription('API Documentation for house chores')
    .setTermsOfService('')
    .setLicense('', '')
    .addServer('http://localhost:3000')
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
