import {NextFunction, Request, Response} from "express";

export interface MiddlewareIn {
    execute: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}