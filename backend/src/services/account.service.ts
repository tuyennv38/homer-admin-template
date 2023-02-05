import { BadGatewayException, Logger } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { Role } from "../schemas/account.schema";
import { ModelService } from "../schemas/service/model.service";
import bcrypt from 'bcrypt';
import Constant from "../enums/constants";
@Injectable()
export class AccountService {
    logger = new Logger();
    constructor(
        private readonly modelService: ModelService
    ) { }

    async create(email: string, password: string, role: Role) {
        if (await this.modelService.accountModel.exists({ email }))
            throw new BadGatewayException("The email is allready existed");
        const passwordHash = await bcrypt.hash(password, Constant.SALT);
        return this.modelService.accountModel.create({
            email,
            password: passwordHash,
            role
        })
    }
    async createAccountDefault() {
        const email = 'admin@gmail.com';
        if (!await this.modelService.accountModel.exists({ email })) {
            const password = '123456'
            this.create(email, password, 'root');
            this.logger.log(`Create default account ${JSON.stringify({ email, password })}`)
        }
    }
    async getAll() {
        return this.modelService.accountModel.find();
    }

}