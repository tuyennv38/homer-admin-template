import { DynamicModule, ForwardReference, Module } from "@nestjs/common";
import { Type } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MongoDBProviders } from "./schemas/service/db.providers";
import { ModelService } from "./schemas/service/model.service";
import { AccountService } from "./services/account.service";
import { AuthService } from "./services/auth.service";

const moduleImport: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
    ConfigModule,
    ...MongoDBProviders,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: {
                expiresIn: configService.get('JWT_TOKEN_EXPIRE'),
            },
        }),
    })
]
const providers = [
    ModelService,
    AccountService,
    AuthService
]

@Module({
    imports: moduleImport,
    providers: [...providers],
    exports: [
        ...moduleImport,
        ...providers
    ]
})
export class BaseModule { }