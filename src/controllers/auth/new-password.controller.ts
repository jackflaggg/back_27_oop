import {Request, Response} from 'express';
import {authService} from "../../domain/auth/auth.service";
import {HTTP_STATUSES} from "../../models/common/common.types";
import {ErrorAuth} from "../../models/auth/ouput/auth.service.models";

export const newPasswordController = async (req: Request, res: Response) => {
    const updatePassword = await authService.newPasswordDate(req.body.newPassword, req.body.recoveryCode);
    if (updatePassword instanceof ErrorAuth || updatePassword.data === null) {
        res
            .sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }
    res
        .sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
}