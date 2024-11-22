import mongoose, {Schema} from "mongoose";

export interface MyDocument extends Document {
    _id: mongoose.Types.ObjectId; // Замените any на конкретный тип, если знаете, например, mongoose.Types.ObjectId
}

export const pluginId = (schema: Schema<MyDocument>) => {
    schema.set('toObject', {virtuals:true});
    schema.set('toJSON', {virtuals:true});
    schema.virtual('id').get(function(){
        return this._id.toString();
    });
};