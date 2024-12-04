import {SessionModelClass} from "../../db/db";
import {transformDevice} from "../../utils/features/mappers/device.mapper";

export class SecurityDevicesQueryRepository {
    async getSessionToUserId(userId: string) {
        const session = await SessionModelClass.find({userId}).lean();
        return session ? session.map(session => transformDevice(session)) : [];
    }
}