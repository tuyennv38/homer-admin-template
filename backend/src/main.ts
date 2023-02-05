import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppClusterService } from './app-cluster.service';
import { AppModule } from './app.module';
import { AccountService } from './services/account.service';
import basicAuth from 'express-basic-auth';

const port = process.env.PORT || 3000;
const STAGE = process.env.STAGE || 'dev';
const logger = new Logger();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const accountService: AccountService = app.get<AccountService>(AccountService);
  await accountService.createAccountDefault();
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');

  const showApiDoc = Boolean(process.env.API_DOC === 'true') || false;
  logger.log(`Show Api doc: ${showApiDoc}`);
  if (showApiDoc) {
    //Nếu cần hiện doc api thì cần password mới hiện được
    const swagger_user = String(process.env.SWAGGER_USER || 'admin');
    const swagger_pass = String(process.env.SWAGGER_PASSWORD || 'admin@123');
    app.use(['/docs'], basicAuth({
      challenge: true,
      users: {
        [swagger_user]: swagger_pass
      },
    }));
    const config = new DocumentBuilder()
      .setTitle('Homer Api')
      .setDescription(
        'Đây là api để ứng dụng tương tác với server',
      )
      .setVersion('1.0')
      .addTag('Homer')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(port);
  logger.log(`[${STAGE}]Application listening on port: ${port}`);
}
if (STAGE === 'dev') {
  bootstrap();
} else if (STAGE === 'staging' || 'prod') {
  AppClusterService.clusterize(STAGE, bootstrap);
}
