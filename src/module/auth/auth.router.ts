import {BaseRouter} from "../../models/base.route";
import {Request, Response, NextFunction} from "express";
import {Limiter} from "../../common/utils/middlewares/limiter.middleware";
import {ValidateMiddleware} from "../../common/utils/middlewares/validate.middleware";
import {AuthService} from "./auth.service";
import {verifyTokenInCookieMiddleware} from "../../common/utils/middlewares/verify.token.in.cookie.middleware";
import {AuthBearerMiddleware} from "../../common/utils/middlewares/auth.bearer.middleware";
import {LoginDto, UserCreateDto} from "../user/dto/user.create.dto";
import {CodeFindDto, EmailFindDto, PasswordAndCodeDto} from "./dto/code.dto";
import {RefreshDto} from "./dto/refresh.dto";
import {UsersQueryRepository} from "../user/users.query.repository";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {dropError} from "../../common/utils/errors/custom.errors";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {injectable} from "inversify";

@injectable()
export class AuthRouter extends BaseRouter{
    constructor(logger: LoggerService, private authService: AuthService) {
        super(logger);
        this.bindRoutes([
            {path: '/login',                        method: 'post', func: this.login,                       middlewares: [new Limiter(), new ValidateMiddleware(LoginDto)]},
            {path: '/refresh-token',                method: 'post', func: this.refreshToken,                middlewares: [new verifyTokenInCookieMiddleware(new LoggerService(), new JwtStrategy(new LoggerService()), this)]},
            {path: '/logout',                       method: 'post', func: this.logout,                      middlewares: [new verifyTokenInCookieMiddleware(new LoggerService(), new JwtStrategy(new LoggerService()), this)]},
            {path: '/registration-confirmation',    method: 'post', func: this.registrationConfirmation,    middlewares: [new Limiter(), new ValidateMiddleware(CodeFindDto)]},
            {path: '/registration',                 method: 'post', func: this.registration,                middlewares: [new Limiter(), new ValidateMiddleware(UserCreateDto)]},
            {path: '/registration-email-resending', method: 'post', func: this.registrationEmailResend,     middlewares: [new Limiter(), new ValidateMiddleware(EmailFindDto)]},
            {path: '/password-recovery',            method: 'post', func: this.passwordRecovery,            middlewares: [new Limiter(), new ValidateMiddleware(EmailFindDto)]},
            {path: '/new-password',                 method: 'post', func: this.newPassword,                 middlewares: [new Limiter(), new ValidateMiddleware(PasswordAndCodeDto)]},
            {path: '/me',                           method: 'get',  func: this.me,                          middlewares: [new AuthBearerMiddleware(new LoggerService(), new UsersQueryRepository(), new JwtStrategy(new LoggerService()), this)]},
        ])
    }
    async login(req: Request, res: Response, next: NextFunction){
        try {
            const auth = await this.authService.login(new LoginDto(req.body.loginOrEmail,
                req.body.password,
                req.ip,
                req.headers["user-agent"]
            ));

            res.cookie('refreshToken', auth.refresh, {httpOnly: true, secure: true, maxAge: 86400})
            this.ok(res, {accessToken: auth.jwt})
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction){
        try {
            const {refreshToken} = req.cookies;

            const {jwt, refresh} = await this.authService.updateRefreshToken(new RefreshDto(refreshToken));

            res.cookie('refreshToken', refresh, {httpOnly: true, secure: true, maxAge: 86400});
            this.ok(res, {accessToken: jwt})
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async logout(req: Request, res: Response, next: NextFunction){
        try {
            const {refreshToken} = req.cookies;

            await this.authService.deleteSessionBeRefreshToken(new RefreshDto(refreshToken));

            this.noContent(res);
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async registrationConfirmation(req: Request, res: Response, next: NextFunction){
        try {
            const { code } = req.body;

            await this.authService.registrationConfirmation(new CodeFindDto(code));

            this.noContent(res);
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async registration(req: Request, res: Response, next: NextFunction){
        try {
            const {login, password, email} = req.body;

            await this.authService.registrationUser(new UserCreateDto(login, password, email));

            this.noContent(res);
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async registrationEmailResend(req: Request, res: Response, next: NextFunction){
        try {
            await this.authService.emailResending(new EmailFindDto(req.body.email))
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async passwordRecovery(req: Request, res: Response, next: NextFunction){
        try {
            await this.authService.passwordRecovery(new EmailFindDto(req.body.email));
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async newPassword(req: Request, res: Response, next: NextFunction){
        try {
            await this.authService.newPassword(new PasswordAndCodeDto(req.body.newPassword, req.body.recoveryCode));
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async me(req: Request, res: Response, next: NextFunction){
        try {
            const {refreshToken} = req.cookies;
            const me = await this.authService.meInfo(new RefreshDto(refreshToken));
            this.ok(res, me);
            return;
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }
}