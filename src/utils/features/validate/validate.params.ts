import mongoose from "mongoose";
import {ThrowError} from "../../errors/custom.errors";
import {HTTP_STATUSES} from "../../../models/common";

export const validateId = (id: string) => {
    const validate = mongoose.Types.ObjectId.isValid(id);
    if (!validate){
        throw new ThrowError(String(HTTP_STATUSES.BAD_REQUEST_400));
    }
    return true;
}