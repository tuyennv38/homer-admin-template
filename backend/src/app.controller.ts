import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AccountService } from './services/account.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly accountService: AccountService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/accounts')
  async getAllAccount() {
    return this.accountService.getAll();
  }
}
