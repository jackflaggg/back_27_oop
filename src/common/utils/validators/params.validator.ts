import mongoose from "mongoose";
import {nameErr} from "../../../models/common";
import {ThrowError} from "../errors/custom.errors";

export const validateId = (id: string) => {
    const validate = mongoose.Types.ObjectId.isValid(id);
    if (!validate){
        throw new ThrowError(nameErr['BAD_REQUEST'], [{message: 'невалидный айди', field: 'id'}]);
    }
    return true;
}