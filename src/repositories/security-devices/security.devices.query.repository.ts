import {outDeviceMapper} from "../../utils/mappers/device.mapper";
import {SessionModelClass} from "../../db/db";

export const securityDevicesQueryRepository = {
    async getSessionToUserId(userId: string) {
        try {
            const oneSession = await SessionModelClass.find({userId}).toArray();
            if (!oneSession) {
                return null;
            }
            return oneSession.map(elem => outDeviceMapper(elem));
        } catch (error: unknown) {
            return null
        }
    }
}