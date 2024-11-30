import {LoggerService} from "../../utils/logger/logger.service";
import {BaseRouter} from "../base.route";
import {Request, Response, NextFunction} from "express";
import {dropError} from "../../utils/errors/custom.errors";

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
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    refreshToken(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    logout(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    registrationConfirmation(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    registration(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    registrationEmailResend(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    passwordRecovery(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    newPassword(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }

    me(req: Request, res: Response, next: NextFunction){
        try {
            this.noContent(res);
        } catch (err: unknown){
            dropError(err, res);
            return;
        }
    }
}