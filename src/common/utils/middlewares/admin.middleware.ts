import {MiddlewareIn} from "./base.middleware";
import {Request, Response, NextFunction} from "express";
import {BaseRouter} from "../../types/base.route";
import {SETTINGS} from "../../config/settings";
import {fromUTF8ToBase64} from "../features/utf8.to.base64";
import {LoggerService} from "../integrations/logger/logger.service";

export class AdminMiddleware implements MiddlewareIn {
    constructor(private readonly logger: LoggerService,
                private readonly router: BaseRouter,){}
    async execute(req: Request, res: Response, next: NextFunction) {
        const {authorization} = req.headers
        if (!authorization || !authorization.startsWith('Basic')) {
            this.logger.error('[AdminMiddleware] не переданы креды');
            this.router.noAuth(res);
            return;
        }

        const coded = fromUTF8ToBase64(SETTINGS.ADMIN);

        if(authorization.slice(6) !== coded){
            this.logger.error('[AdminMiddleware] неверные креды!');
            this.router.noAuth(res);
            return;
        }
        next();
    }
}