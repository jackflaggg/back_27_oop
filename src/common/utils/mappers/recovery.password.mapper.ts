import {FlattenMaps} from "mongoose";
import {ObjectId} from "mongodb";

export interface transformRecPassInterface {
    id: string,
    userId: string,
    expirationDate: Date | string,
    recoveryCode: string,
    used: boolean,
}
export function transformRecoveryPassword(value: FlattenMaps<
    {
        userId?: string | null | undefined;
        recoveryCode?: string | null | undefined;
        expirationDate?: Date | null | undefined;
        used?: boolean | null | undefined;
        _id: ObjectId}>): transformRecPassInterface {
    return {
        id: String(value._id),
        userId: value.userId || '',
        expirationDate: value.expirationDate || '',
        recoveryCode: value.recoveryCode || '',
        used: value.used || false,
    }
}