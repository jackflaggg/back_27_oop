import {NextFunction, Request, Response} from "express";

export interface vercelRouterInterface {
    getVersionVercel: (req: Request, res: Response, next: NextFunction) => Promise<void>
}