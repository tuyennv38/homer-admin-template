import { Module } from '@nestjs/common';
import { BaseModule } from '../base.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    BaseModule
  ],
  controllers: [AuthController]
})
export class AuthModule { }
