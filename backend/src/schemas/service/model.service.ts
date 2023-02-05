import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Account } from "../account.schema";

@Injectable()
export class ModelService {
    constructor(
        @InjectModel(Account.getModelName()) public readonly accountModel: Model<Account>,
    ) { }
}