import {LoggerService} from "../utils/logger/logger.service";
import { Router, Response } from "express";
import {RouteInterface} from "./route.interface";
import {HTTP_STATUSES} from "../models/common";


export abstract class BaseRouter {
    private readonly _router: Router;

    constructor(private logger: LoggerService) {
        this._router = Router();
    }

    get router(){
        return this._router;
    }

    notFound(res: Response) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    created<T>(res: Response, msg: T){
        this.send(res, HTTP_STATUSES.CREATED_201, msg);
    }

    send<T>(res: Response, code: number, msg: T){
        res.type('application/json');
        return res.status(code).send(msg);
    }

    ok<T>(res: Response, msg: T){
        return this.send<T>(res, HTTP_STATUSES.OK_200, msg);
    }

    noAuth(res: Response){
        res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401);
        return;
    }

    noContent(res: Response){
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        return;
    }

    badRequest<T>(res: Response, err: T){
        this.send<T>(res, HTTP_STATUSES.BAD_REQUEST_400, err);
    }

    serverError(res: Response){
        res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
        return;
    }

    protected bindRoutes(routes: RouteInterface[]){
        for(let route of routes){
            this.logger.log(`[${route.method}] ${route.path}]`);
            // проблема потери контекста
            const handler = route.func.bind(this);
            this.router[route.method](route.path, handler);
        }
    }
}