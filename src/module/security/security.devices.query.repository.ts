import {SessionModelClass} from "../../common/database";
import {transformDevice} from "../../common/utils/mappers/device.mapper";

export class SecurityDevicesQueryRepository {
    async getSessionToUserId(userId: string) {
        const session = await SessionModelClass.find({userId}).lean();
        return session ? session.map(session => transformDevice(session)) : [];
    }
}