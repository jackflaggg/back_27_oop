import {inject, injectable} from "inversify";
import {UserService} from "../../../module/user/user.service";
import {TYPES} from "../../types/types";
import {JwtStrategy} from "../../../module/auth/strategies/jwt.strategy";

@injectable()
export class UserGetter {
    constructor(@inject(TYPES.JwtStrategy) private jwtStrategy: JwtStrategy) {}
    async execute(token?: string){
        const result = token && await this.jwtStrategy.verifyAccessToken(token);
        if (!result){
            return;
        }
        return result;
    }
}