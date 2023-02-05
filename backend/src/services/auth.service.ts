import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '../auth/jwt/jwt.payload';
import { JwtService } from '@nestjs/jwt';
import { ModelService } from '../schemas/service/model.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly modelService: ModelService
    ) { }


    async login(email: string, password: string) {
        const account = await this.modelService.accountModel.findOne({ email });
        if (!account) {
            throw new NotFoundException('Email này không tồn tại trong database')
        }
        if (! await bcrypt.compare(password, account.password)) {
            throw new BadRequestException('Mật khẩu đăng nhập không đúng')
        }
        const { _id, role } = account;
        const payload: JwtPayload = { email, sub: _id, role };
        const accessToken: string = this.jwtService.sign(payload);
        return { accessToken }
    }
}
