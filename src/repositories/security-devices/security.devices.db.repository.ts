import {SessionModelClass} from "../../db/db";
import {ObjectId} from "mongodb";

export class SecurityDevicesDbRepository  {
    async createSession(dto: any){
        return await SessionModelClass.insertMany([dto]);
    }

    async deleteSession(deviceId: string) {
        return await SessionModelClass.deleteOne({deviceId})
    }

    async deleteAllSession( refreshToken: string) {
        return await SessionModelClass.deleteMany({refreshToken})
    }

    async deleteSessionByRefreshToken(refreshToken: string) {
        const res = await SessionModelClass.deleteOne({refreshToken});
        return res.deletedCount === 1
    }

    async getSessionByDeviceIdAndIat(issuedAt: Date, deviceId: string) {
        const filter = {
            $and: [
                {issuedAt},
                {deviceId}
            ]
        }

        const session = await SessionModelClass.findOne(filter);
        if (!session){
            return;
        }
        return session
    }

    async getSessionByDeviceId(deviceId: string) {

        const session = await SessionModelClass.findOne({deviceId});

        if (!session){
            return;
        }
        return session
    }

    async updateSession(ip: string, issuedAt: string, deviceId: string, deviceTitle: string, userId: string, oldRefreshToken: string, newRefreshToken: string) {

    }

    async updateSessionToIssuedAt(id: ObjectId, issuedAt: Date, refreshToken: string){
        const lastActiveDate = new Date();
        const updateDate = await SessionModelClass.findOneAndUpdate({
            _id: id,
        }, {
            issuedAt,
            lastActiveDate,
            refreshToken
        })
        return updateDate;
    }
}