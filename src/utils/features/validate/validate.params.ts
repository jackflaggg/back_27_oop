import mongoose from "mongoose";
import {errorsMessages, ThrowError} from "../../errors/custom.errors";
import {HTTP_STATUSES, nameErr} from "../../../models/common";

export const validateId = (id: string) => {
    const validate = mongoose.Types.ObjectId.isValid(id);
    if (!validate){
        throw new ThrowError(nameErr['BAD_REQUEST'], [{message: 'невалидный айди', field: 'id'}]);
    }
    return true;
}