import {Response, Request, NextFunction, Router} from "express";

export interface RouteInterface {
    path: string;
    func: (req: Request, res: Response, next: NextFunction) => void;
    method: keyof Pick<Router, 'get' | 'post' | 'put' | 'delete'>;
}
