import {Request, Response} from 'express';
import {authService} from "../../domain/auth/auth.service";
import {HTTP_STATUSES} from "../../models/common/common.types";
import {ErrorAuth} from "../../models/auth/ouput/auth.service.models";

export const passwordRecoveryController = async (req: Request, res: Response) => {
    const sendSMS = await authService.passwordRecovery(req.body.email);
    if (sendSMS instanceof ErrorAuth || sendSMS.data === null){
        res
            .sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }
    res
        .sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
}