import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './filters/all-exception-filter';
import { ConfigService } from '@nestjs/config';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: false,
  });

  app.useGlobalFilters(new AllExceptionFilter(configService));
  app.use(
    graphqlUploadExpress({ maxFileSize: 1024 * 1024 * 10, maxFiles: 10 }),
  );
  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
