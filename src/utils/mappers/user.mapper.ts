import {OutUserById} from "../../models/user/ouput/output.type.users";
import {ObjectId, WithId} from "mongodb";
import {UserDbType} from "../../models/db/db.models";
import {FlattenMaps} from "mongoose";

export const userMapperToOutput = (user: WithId<UserDbType>)=> ({
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
})

export const loginUserMapper = (user: OutUserById) => ({
        email: user.email,
        login: user.login,
        userId: user.id
})

export function transformUserToOut(value: FlattenMaps<
    {
            login?: string | null | undefined;
            email?: string | null | undefined;
            createdAt?: string | null | undefined;
            _id: ObjectId}>) {
        return {
                id: String(value._id),
                login: value.login || '',
                email: value.email || '',
                createdAt: value.createdAt || '',
        }
}

export function transformUserToLogin(value: FlattenMaps<
    {
            login?: string | null | undefined;
            email?: string | null | undefined;
            createdAt?: string | null | undefined;
            userId?: string | null | undefined}>) {
        return {
                login: value.login || '',
                email: value.email || '',
                userId: value.userId || '',
        }
}