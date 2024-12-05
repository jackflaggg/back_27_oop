import {Request} from "express";
declare global {
    namespace Express {
        export interface Request {
            userId?: any | null | string
        }
    }
}