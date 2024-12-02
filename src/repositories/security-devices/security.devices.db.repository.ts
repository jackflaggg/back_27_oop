import {SessionModelClass} from "../../db/db";

export class SecurityDevicesDbRepository  {
    async createSession(dto: any){
        return await SessionModelClass.insertMany([dto]);
    }

    async deleteSession(deviceId: string, userId: string) {

    }

    async deleteAllSession(userId: string, refreshToken: string) {

    }

    async deleteSessionByRefreshToken(refreshToken: string) {

    }

    async getSessionByRefreshToken(refreshToken: string) {

    }

    async getSessionByDeviceId(deviceId: string) {

    }

    async updateSession(ip: string, issuedAt: string, deviceId: string, deviceTitle: string, userId: string, oldRefreshToken: string, newRefreshToken: string) {
    }
}