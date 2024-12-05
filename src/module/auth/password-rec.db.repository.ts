import {RecoveryPasswordModelClass} from "../../common/database";
import {ObjectId} from "mongodb";

export class PasswordRecoveryDbRepository  {
    async createCodeAndDateConfirmation(userId: ObjectId, code: string, expirationDate: Date) {
        return await RecoveryPasswordModelClass.create({userId, recoveryCode: code, expirationDate});
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

    async updateStatus(id: ObjectId){
        const updateDate = await RecoveryPasswordModelClass.updateOne({_id: id}, {$set: {used: true}});
        return updateDate.modifiedCount === 1;
    }
}