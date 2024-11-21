import {Request, Response, NextFunction} from "express";
import {LoggerService} from "../logger/logger.service";
import {HTTP_STATUSES} from "../../models/common";

export class ExceptionFilter {
    logger: LoggerService;

    constructor(logger: LoggerService){
        this.logger = logger;
    }

    catch(err: Error, req: Request, res: Response, next: NextFunction) {
        this.logger.error(`${err.message}`);
        res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).send({err: err.message});
    }
}