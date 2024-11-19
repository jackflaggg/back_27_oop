import {InDeviceSession} from "../../models/devices/input/create.device.session.model";
import {DeleteResult, UpdateResult, WithId} from "mongodb";
import {SessionCollection} from "../../models/db/db.models";
import {SessionModelClass} from "../../db/db";

export const SecurityDevicesDbRepository = {
    async createSession(modelDevice: InDeviceSession): Promise<string | null> {
        try {
            const lastActiveDate = new Date().toISOString();
            const session = {
                deviceId: modelDevice.deviceId,
                userId: modelDevice.userId,
                ip: modelDevice.ip,
                deviceName: modelDevice.deviceName,
                refreshToken: modelDevice.refreshToken,
                lastActiveDate,
                issuedAt: lastActiveDate,
            }
            const createSession = await SessionModelClass.insertMany([session]);
            return String(createSession[0]._id);

        } catch (error: unknown) {
            console.log('[SecurityDevicesDbRepository] Непредвиденная ошибка в бд! ', String(error));
            return null;
        }
    },

    async deleteSession(deviceId: string, userId: string): Promise<boolean | null> {
        try {
            const deleteRes = await SessionModelClass.deleteOne({deviceId, userId})
            return deleteRes.deletedCount === 1;
        } catch (error: unknown){
            console.log('[SecurityDevicesDbRepository] Непредвиденная ошибка в бд! ', String(error));
            return null;
        }
    },

    async deleteAllSession(userId: string, refreshToken: string): Promise<DeleteResult | null> {
        try {
            return await SessionModelClass.deleteMany([{userId, refreshToken: {$ne: refreshToken}}]);
        } catch (error: unknown){
            console.log('[SecurityDevicesDbRepository] Непредвиденная ошибка в бд! ', String(error));
            return null;
        }
    },

    async deleteSessionByRefreshToken(refreshToken: string): Promise<boolean | null> {
        try {
            const res = await SessionModelClass.deleteOne({refreshToken});
            return res.deletedCount === 1
        } catch (error: unknown){
            console.log('[SecurityDevicesDbRepository] Непредвиденная ошибка в бд! ', String(error));
            return null;
        }
    },

    async getSessionByRefreshToken(refreshToken: string): Promise<WithId<SessionCollection> | null> {
        try {
            return await SessionModelClass.findOne({refreshToken});
        } catch (err: unknown){
            console.log('[SecurityDevicesDbRepository] Непредвиденная ошибка в бд! ', String(err));
            return null;
        }
    },

    async getSessionByDeviceId(deviceId: string): Promise<WithId<SessionCollection> | null> {
        try {
            return await SessionModelClass.findOne({deviceId});
        } catch (err: unknown){
            console.log('[SecurityDevicesDbRepository] Непредвиденная ошибка в бд! ', String(err));
            return null;
        }
    },

    async updateSession(ip: string, issuedAt: string, deviceId: string, deviceTitle: string, userId: string, oldRefreshToken: string, newRefreshToken: string): Promise<boolean | null> {
        const lastActiveDate = new Date().toISOString();
        const deviceName = deviceTitle;

        const session = await SecurityDevicesDbRepository.getSessionByRefreshToken(oldRefreshToken);
        if (!session){
            return null
        }

        try {
            const updateDate = await SessionModelClass.updateOne({refreshToken: oldRefreshToken},
                {
                    $set: {
                        issuedAt,
                        lastActiveDate,
                        deviceId,
                        ip,
                        deviceName,
                        userId,
                        refreshToken: newRefreshToken
                    }
                });
            return updateDate.matchedCount === 1
        } catch (err: unknown) {
            console.log('[SecurityDevicesDbRepository] Непредвиденная ошибка в бд! ', String(err));
            return null;
        }
    }
}