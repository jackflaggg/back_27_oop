import {RecoveryPasswordModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {
    transformRecoveryPassword,
    transformRecPassInterface
} from "../../common/utils/mappers/recovery.password.mapper";
import {injectable} from "inversify";
import {PasswordRecoveryDbRepositoryInterface} from "../user/models/user.models";

@injectable()
export class PasswordRecoveryDbRepository implements PasswordRecoveryDbRepositoryInterface {
    async createCodeAndDateConfirmation(userId: ObjectId, code: string, expirationDate: Date | string | null): Promise<transformRecPassInterface> {
        const pass =  await RecoveryPasswordModelClass.create({userId, recoveryCode: code, expirationDate});
        return transformRecoveryPassword(pass);
    }

    async findRecoveryCodeUser(code: string): Promise<transformRecPassInterface | void> {
        const findUser = await RecoveryPasswordModelClass.findOne({
            recoveryCode: code
        });

        if (!findUser){
            return;
        }

        return transformRecoveryPassword(findUser);
    }

    async updateStatus(id: ObjectId): Promise<boolean>{
        const updateDate = await RecoveryPasswordModelClass.updateOne({_id: id}, {$set: {used: true}});
        return updateDate.modifiedCount === 1;
    }
}