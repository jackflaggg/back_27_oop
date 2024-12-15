import {NextFunction, Request, Response} from "express";

export interface sessionRouterInterface {
    getAllSessions: (req: Request, res: Response, next: NextFunction) => Promise<void>
    deleteSessions: (req: Request, res: Response, next: NextFunction) => Promise<void>
    deleteSession: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export interface transformDeviceInterface {
    ip: string,
    title: string,
    lastActiveDate: Date,
    deviceId: string,
}

export interface securityDevicesQueryRepoInterface {
    getSessionToUserId: (userId: string) => Promise<transformDeviceInterface[] | void[]>
}

export interface mappingSessionInterface {
    issuedAt: Date,
    deviceId: string,
    userId: string,
    ip: string,
    lastActiveDate: Date,
    deviceName: string,
    refreshToken: string
}