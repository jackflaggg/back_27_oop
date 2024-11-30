import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {Request, Response, NextFunction} from "express";
import {dropError} from "../../utils/errors/custom.errors";
import {Limiter} from "../../middlewares/limiter.middleware";
import {ValidateMiddleware} from "../../middlewares/validate.middleware";
import {UserCreateDto} from "../../dto/user/user.create.dto";

export class AuthRouter extends BaseRouter{
    constructor(logger: LoggerService) {
        super(logger);
        this.bindRoutes([
            {path: '/login',                        method: 'post', func: this.login},
            {path: '/refresh-token',                method: 'post', func: this.refreshToken},
            {path: '/logout',                       method: 'post', func: this.logout},
            {path: '/registration-confirmation',    method: 'post', func: this.registrationConfirmation},
            {path: '/registration',                 method: 'post', func: this.registration, middlewares: [new Limiter(), new ValidateMiddleware(UserCreateDto)]},
            {path: '/registration-email-resending', method: 'post', func: this.registrationEmailResend},
            {path: '/password-recovery',            method: 'post', func: this.passwordRecovery},
            {path: '/new-password',                 method: 'post', func: this.newPassword},
            {path: '/me',                           method: 'get',  func: this.me},
        ])
    }
    async login(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async logout(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async registrationConfirmation(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async registration(req: Request, res: Response, next: NextFunction){
        try {
            const {login, password, email} = req.body;
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async registrationEmailResend(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async passwordRecovery(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async newPassword(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    async me(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }
}