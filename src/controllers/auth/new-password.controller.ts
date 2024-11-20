import {Request, Response} from 'express';
import {authService} from "../../domain/auth/auth.service";
import {HTTP_STATUSES} from "../../models/common/common.types";

export const newPasswordController = async (req: Request, res: Response) => {
    const updatePassword = await authService.newPassword(req.body.newPassword, req.body.recoveryCode);
    if (!updatePassword) {
        res
            .sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }
    res
        .sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    return;
}