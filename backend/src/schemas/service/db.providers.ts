import { MongooseModule } from "@nestjs/mongoose";
import { Account, AccountSchema } from "../account.schema";

export const MongoDBProviders = [
    //Main database
    MongooseModule.forFeature([
        { name: Account.getModelName(), schema: AccountSchema }
    ])
]
