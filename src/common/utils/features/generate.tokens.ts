import {JwtStrategy} from "../../../module/auth/strategies/jwt.strategy";
import {inject} from "inversify";
import {TYPES} from "../../types/types";

export class GenerateTokens {
    constructor(@inject(TYPES.JwtStrategy) private jwtService: JwtStrategy, private userId: string, private deviceId: string) {
    }

    async generateTokens(){
        const accessToken = this.jwtService.createAccessToken(this.userId);
        const refreshToken = this.jwtService.createRefreshToken(this.userId, this.deviceId);
        return {
            access: await accessToken,
            refresh: await refreshToken
        }
    }
}