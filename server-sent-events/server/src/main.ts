import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerDocument = new DocumentBuilder()
    .setTitle('Система уведомлений, графиков и прочее')
    .setVersion('1.0.0')
    .setDescription('Примеры запросов')
    .build();

  const swaggerFactory = SwaggerModule.createDocument(app, swaggerDocument);
  SwaggerModule.setup('/api/docs', app, swaggerFactory, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
