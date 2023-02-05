import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Account } from '../../schemas/account.schema';



export const GetAccount = createParamDecorator(
    (_data, ctx: ExecutionContext): Account => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    },
);
