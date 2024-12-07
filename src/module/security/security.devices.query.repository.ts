import {SessionModelClass} from "../../common/database";
import {transformDevice} from "../../common/utils/mappers/device.mapper";
import {securityDevicesQueryRepoInterface, transformDeviceInterface} from "../../models/session/session.models";

export class SecurityDevicesQueryRepository implements securityDevicesQueryRepoInterface {
    async getSessionToUserId(userId: string): Promise<transformDeviceInterface[] | void[]> {
        const session = await SessionModelClass.find({userId}).lean();
        return session ? session.map(session => transformDevice(session)) : [];
    }
}