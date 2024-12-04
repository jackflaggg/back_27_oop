import {JwtService} from "../../jwt/jwt.service";

export class generateTokens {
    constructor(private jwtService: JwtService, private userId: string, private deviceId: string) {
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