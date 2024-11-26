import mongoose from "mongoose";

export const validateId = (id: string) => {
    return mongoose.Types.ObjectId.isValid(id);
}