import {Request, Response} from 'express';
import {authService} from "../../domain/auth/auth.service";

export const passwordRecoveryController = async (req: Request, res: Response) => {
    const sendSMS = await authService.passwordRecovery(req.body.password);
}