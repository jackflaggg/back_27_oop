import {Request, Response, NextFunction} from "express";
import {ExceptionFilterInterface} from "./exception.filter.interface";
import {HTTPError} from "./http.error";
import {HTTP_STATUSES} from "../../types/common";
import {LoggerService} from "../integrations/logger/logger.service";


export class ExceptionFilter implements ExceptionFilterInterface {
    logger: LoggerService;

    constructor(logger: LoggerService){
        this.logger = logger;
    }

    catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
        if (err instanceof HTTPError) {
            this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
            res.status(err.statusCode).send({err: err.message});
        }
        this.logger.error(`${err.message}`);
        res.status(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500).send({err: err.message});
    }
}