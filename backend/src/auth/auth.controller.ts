import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }
    @Post('login')
    @ApiOperation({ summary: 'Đăng nhập tài khoản và lấy accesstoken' })
    async login(@Body() loginDto: LoginDto) {
        const { email, password } = loginDto;
        const result = await this.authService.login(email, password);
        return result;
    }
}
