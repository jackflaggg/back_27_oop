import {MiddlewareIn} from "./base.middleware";
import {validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";
import {BaseRouter} from "../../../models/base.route";

export class CheckErrorsMiddleware implements MiddlewareIn {
    constructor(private readonly router: BaseRouter,) {}
    async execute(req: Request, res: Response, next: NextFunction) {
        const e = validationResult(req);
        if (!e.isEmpty()) {
            const eArray = e.array({onlyFirstError: true}) as { path: string, msg: string }[]

            if (eArray.find(err => err?.path === 'id')){
                this.router.notFound(res);
                return;
            }
           this.router.badRequest(res, {
               errorsMessages: [ eArray.map(x => ({ message: x.msg, field: x.path}))[0] ]
           })
            return;
        }

        next()
    }

}