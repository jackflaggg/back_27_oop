import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {Request, Response, NextFunction} from "express";

export class AuthRouter extends BaseRouter{
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            {path: '/login',                        method: 'post', func: this.login},
            {path: '/refresh-token',                method: 'post', func: this.refreshToken},
            {path: '/logout',                       method: 'post', func: this.logout},
            {path: '/registration-confirmation',    method: 'post', func: this.registrationConfirmation},
            {path: '/registration',                 method: 'post', func: this.registration},
            {path: '/registration-email-resending', method: 'post', func: this.registrationEmailResend},
            {path: '/password-recovery',            method: 'post', func: this.passwordRecovery},
            {path: '/new-password',                 method: 'post', func: this.newPassword},
            {path: '/me',                           method: 'get',  func: this.me},
        ])
    }
    login(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'login user');
    }

    refreshToken(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'refresh token');
    }

    logout(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }

    registrationConfirmation(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }

    registration(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }

    registrationEmailResend(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }

    passwordRecovery(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }

    newPassword(req: Request, res: Response, next: NextFunction){
        this.noContent(res);
    }

    me(req: Request, res: Response, next: NextFunction){
        this.ok(res, 'me')
    }
}