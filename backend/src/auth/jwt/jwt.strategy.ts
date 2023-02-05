import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload';
import { ModelService } from '../../schemas/service/model.service';
import { Account } from '../../schemas/account.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private modelService: ModelService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET') || 'abclsfjlsajfwelsfsf',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<Account> {
        const { email } = payload;
        const account = await this.modelService.accountModel.findOne({ email });

        if (!account) {
            throw new UnauthorizedException();
        }
        return account;
    }
}
