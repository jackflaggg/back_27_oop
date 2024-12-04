import {JwtService} from "../../utils/jwt/jwt.service";
import {SecurityDevicesDbRepository} from "../../repositories/security-devices/security.devices.db.repository";
import {validateId} from "../../utils/features/validate/validate.params";
import {Session} from "../../dto/session/create.session";
import {ObjectId} from "mongodb";
import {ThrowError} from "../../utils/errors/custom.errors";
import {nameErr} from "../../models/common";
import {JwtPayload} from "jsonwebtoken";

export class SecurityService {
    constructor(private readonly jwtService: JwtService,
                private readonly securityRepository: SecurityDevicesDbRepository) {
    }

    async deleteAllSessions(refreshToken: string){
        await this.securityRepository.deleteAllSession(refreshToken);
    }

    async deleteOneSession(device: string, token: string){
        validateId(device);
        const findDevice = await this.securityRepository.getSessionByDeviceId(device);

        if (!findDevice){
            throw new ThrowError(nameErr['NOT_FOUND']);
        }

        const {userId, deviceId} = await this.jwtService.decodeToken(token) as JwtPayload;

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

    async deleteSessionByRefreshToken(refreshToken: string){
        return await this.securityRepository.deleteSessionByRefreshToken(refreshToken);
    }
}