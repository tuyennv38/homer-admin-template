import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail } from 'class-validator';

const allRoles=['root'] as const
export type Role = typeof allRoles[number]
export const listRoles=[...allRoles]
@Schema(
    {
        versionKey: false,
        timestamps: {
            createdAt: false,
            updatedAt: false,
        }
    }
)
export class Account extends Document {
    @Prop({ required: true, unique: true })
    @IsEmail()
    email: string;

    @Prop()
    role: Role;

    @Prop({ type: String })
    password: string;

    public static getModelName() {
        return 'Account';
    }
}

export const AccountSchema = SchemaFactory.createForClass(Account);
