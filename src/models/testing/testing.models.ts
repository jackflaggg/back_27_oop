import {NextFunction, Request, Response} from "express";

export interface testingRouterInterface {
    deleteAll: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}