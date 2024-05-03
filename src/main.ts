import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentConfigService } from './infrastructures/config/environment-config/environment-config.service';
import { GlobalExceptionFilter } from './presentations/exceptions/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = app.get(EnvironmentConfigService);

  const PORT = config.getAppPort() || 3000;

  await app.listen(PORT);
}
bootstrap();
