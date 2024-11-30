import {RecoveryPasswordModelClass} from "../../db/db";
import {ObjectId} from "mongodb";

export class PasswordRecoveryDbRepository  {
    async createCodeAndDateConfirmation(userId: ObjectId, code: string, expirationDate: Date) {
        return await RecoveryPasswordModelClass.create({userId, recoveryCode: code, expirationDate});
    }

    async deleteDate(userId: string){
        const result = await RecoveryPasswordModelClass.deleteOne({userId});
        return result.deletedCount === 1;
    }

    async findRecoveryCodeUser(code: string) {
        const findUser = await RecoveryPasswordModelClass.findOne({
            recoveryCode: code
        });

        if (!findUser){
            return;
        }

        return findUser;
    }

    async updateRecoveryCode(userId: string, code: string) {
        const updateDate = await RecoveryPasswordModelClass.updateOne({userId, recoveryCode: code}, {$set: {expirationDate: null}});
        return updateDate.modifiedCount === 1;
    }
}