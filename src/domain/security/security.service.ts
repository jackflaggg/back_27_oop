import {JwtService} from "../../utils/jwt/jwt.service";
import {SecurityDevicesDbRepository} from "../../repositories/security-devices/security.devices.db.repository";
import {validateId} from "../../utils/features/validate/validate.params";

export class SecurityService {
    constructor(private readonly jwtService: JwtService,
                private readonly securityRepository: SecurityDevicesDbRepository) {
    }

    async deleteAllSessions(refreshToken: string){
        const userDate = await this.jwtService.getUserIdByRefreshToken(refreshToken);
        await this.securityRepository.deleteAllSession(userDate.userId, refreshToken);
    }

    async deleteOneSession(deviceId: string, userId: string){
        validateId(deviceId)
        await this.securityRepository.deleteSession(deviceId, userId);
    }
}