import {WithId} from "mongodb";
import {SessionCollection} from "../../models/db/db.models";

export const outDeviceMapper = (model: WithId<SessionCollection>) => {
    return {
        ip: model.ip,
        title: model.deviceName,
        lastActiveDate: model.lastActiveDate,
        deviceId: model.deviceId,
    }
}