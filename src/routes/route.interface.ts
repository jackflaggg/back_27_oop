import {Response, Request, NextFunction, Router} from "express";

export interface IMiddleware {
    execute(req: Request, res: Response, next: NextFunction): void | Promise<void>;
}

export interface RouteInterface {
    path: string;
    func: (req: Request, res: Response, next: NextFunction) => void;
    method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete'>;
    middlewares?: IMiddleware[]
}
