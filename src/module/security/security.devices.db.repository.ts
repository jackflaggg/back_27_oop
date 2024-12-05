import {SessionModelClass} from "../../common/database";
import {ObjectId} from "mongodb";

export class SecurityDevicesDbRepository  {
    async createSession(dto: any){
        return await SessionModelClass.insertMany([dto]);
    }

    async deleteSession(deviceId: string) {
        return await SessionModelClass.deleteOne({deviceId})
    }

    async deleteAllSession( userId: string, deviceId: string) {
        return await SessionModelClass.deleteMany({
            userId,
            deviceId: { $ne: deviceId }})
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