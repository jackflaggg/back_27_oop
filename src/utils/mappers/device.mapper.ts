import {ObjectId, WithId} from "mongodb";
import {SessionCollection} from "../../models/db/db.models";
import {FlattenMaps} from "mongoose";

export const outDeviceMapper = (model: WithId<SessionCollection>) => {
    return {
        ip: model.ip,
        title: model.deviceName,
        lastActiveDate: model.lastActiveDate,
        deviceId: model.deviceId,
    }
}

export function transformDevice(value: FlattenMaps<
    {
        issuedAt?: string | null | undefined;
        deviceId?: string | null | undefined;
        userId?: string | null | undefined;
        ip?: string | null | undefined;
        lastActiveDate?: string | null | undefined;
        deviceName?: string | null | undefined;
        refreshToken?: string | null | undefined;
        _id: ObjectId}>) {
    return {
        ip: value.ip || '',
        title: value.deviceName || '',
        lastActiveDate: value.lastActiveDate || '',
        deviceId: value.deviceId || '',
    }
}