import mongoose from "mongoose";
import {ThrowError} from "../../errors/custom.errors";

export const validateId = (id: string) => {
    const validate = mongoose.Types.ObjectId.isValid(id);
    if (!validate){
        throw new ThrowError("id is required");
    }
    return true;
}