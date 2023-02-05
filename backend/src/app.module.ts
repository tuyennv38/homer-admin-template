import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseModule } from './base.module';
import { configValidationSchema } from './config.schema';
import { AuthModule } from './auth/auth.module';
import Constant from './enums/constants';
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: Number(process.env.THROTTLE || 1000) //1000 request trong 1 phut
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, { serverSelectionTimeoutMS: Constant.DB_CONNECTION_TIMEOUT }),
    BaseModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Set security HTTP headers
    consumer.apply(helmet()).forRoutes({ path: '*', method: RequestMethod.ALL });
    // Prevent parameter pollution
    consumer.apply(hpp()).forRoutes({ path: '*', method: RequestMethod.ALL });
    // Data sanitization against Nosql query injection
    consumer.apply(mongoSanitize()).forRoutes({ path: '*', method: RequestMethod.ALL })
    // Data sanitization against XSS(clean user input from malicious HTML code)
    consumer.apply(xss()).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
