import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
