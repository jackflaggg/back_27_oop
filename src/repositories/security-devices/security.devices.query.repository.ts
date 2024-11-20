import {transformDevice} from "../../utils/mappers/device.mapper";
import {SessionModelClass} from "../../db/db";

export const securityDevicesQueryRepository = {
    async getSessionToUserId(userId: string): Promise<null | any> {
        try {
            const oneSession = await SessionModelClass.find({userId}).lean();
            if (!oneSession) {
                return null;
            }
            return oneSession.map(elem => transformDevice(elem));
        } catch (error: unknown) {
            return null
        }
    }
}