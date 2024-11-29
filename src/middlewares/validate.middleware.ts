import {NextFunction, Request, Response} from "express";
import {ClassConstructor, plainToClass} from "class-transformer";
import {validate} from "class-validator";
import {HTTP_STATUSES} from "../models/common";

export class ValidateMiddleware {
    constructor(private classToValidate: ClassConstructor<object>) {}

    execute(req: Request, res: Response, next: NextFunction): void {

        const instance = plainToClass(this.classToValidate, req.body);

        validate(instance).then((err) => {
            if (err.length) {
                res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
                    errorsMessages: [err.map(x => ({
                        message: x.constraints ? Object.values(x.constraints)[0]: x.value,
                        field: x.property
                    }))[0]]
                })
                return;
            }
            next();
        })
    };
}
