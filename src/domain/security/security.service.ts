import {JwtService} from "../../utils/jwt/jwt.service";
import {SecurityDevicesDbRepository} from "../../repositories/security-devices/security.devices.db.repository";

export class SecurityService {
    constructor(private readonly jwtService: JwtService,
                private readonly securityRepository: SecurityDevicesDbRepository) {
    }

    async deleteAllSessions(refreshToken: string){
        const userDate = await this.jwtService.getUserIdByRefreshToken(refreshToken);
        await this.securityRepository.deleteAllSession(userDate.userId, refreshToken);
    }

    async deleteOneSession(deviceId: string, userId: string){
        await this.securityRepository.deleteSession(deviceId, userId);
    }
}