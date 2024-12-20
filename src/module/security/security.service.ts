import {validateId} from "../../common/utils/validators/params.validator";
import {ObjectId} from "mongodb";
import {nameErr} from "../../common/types/common";
import {JwtPayload} from "jsonwebtoken";
import {Session} from "./dto/create.session";
import {SecurityDevicesDbRepository} from "./security.devices.db.repository";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {jwtStrategyInterface} from "../user/models/user.models";
import {inject, injectable} from "inversify";
import {TYPES} from "../../common/types/types";

@injectable()
export class SecurityService {
    constructor(
        @inject(TYPES.JwtStrategy) private readonly jwtStrategy: jwtStrategyInterface,
        @inject(TYPES.SecurityDevicesDbRepo) private readonly securityRepository: SecurityDevicesDbRepository) {}
    async deleteAllSessions(refreshToken: string): Promise<void>{
        const { userId, deviceId } = await this.jwtStrategy.decodeToken(refreshToken) as JwtPayload;
        await this.securityRepository.deleteAllSession(userId, deviceId);
    }

    async deleteOneSession(device: string, token: string): Promise<void>{
        validateId(device);
        const findDevice = await this.securityRepository.getSessionByDeviceId(device);

        if (!findDevice){
            throw new ThrowError(nameErr['NOT_FOUND']);
        }

        const {userId, deviceId} = await this.jwtStrategy.decodeToken(token) as JwtPayload;

        if (userId !== findDevice.userId){
            throw new ThrowError(nameErr['NOT_FORBIDDEN']);
        }

        await this.securityRepository.deleteSession(device);
    }

    async createSession(dto: Session){
        const session = dto.mappingSession();
        return await this.securityRepository.createSession(session);
    }

    async findToken(issuedAt: Date, deviceId: string){
        return await this.securityRepository.getSessionByDeviceIdAndIat(issuedAt, deviceId);
    }

    async updateSession(id: ObjectId, issuedAtToken: Date, refreshToken: string){
        return await this.securityRepository.updateSessionToIssuedAt(id, issuedAtToken, refreshToken);
    }

    async deleteSessionByRefreshToken(refreshToken: string): Promise<boolean>{
        return await this.securityRepository.deleteSessionByRefreshToken(refreshToken);
    }
}