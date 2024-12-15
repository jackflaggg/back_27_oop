import {FlattenMaps} from "mongoose";
import {ObjectId} from "mongodb";
import {transformDeviceInterface} from "../../../module/security/models/session.models";

export function transformDevice(value: FlattenMaps<
    {
        issuedAt?: Date | null | undefined;
        deviceId?: string | null | undefined;
        userId?: string | null | undefined;
        ip?: string | null | undefined;
        lastActiveDate?: Date | null | undefined;
        deviceName?: string | null | undefined;
        refreshToken?: string | null | undefined;
        _id: ObjectId}>): transformDeviceInterface {
    return {
        ip: value.ip || '',
        title: value.deviceName || '',
        lastActiveDate: value.lastActiveDate || new Date(0),
        deviceId: value.deviceId || '',
    }
}