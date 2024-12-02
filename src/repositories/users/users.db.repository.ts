import {UserModelClass} from "../../db/db";
import {ObjectId} from "mongodb";
import {createUserInterface} from "../../models/user/user.models";
import {transformUserToOut} from "../../utils/features/mappers/user.mapper";

export class UsersDbRepository {
    constructor(){}
    async createUser(entity: createUserInterface){
        return await UserModelClass.insertMany([
            entity
        ]);
    }

    async updateUserToPass(userId: string, password: string){
        const updateEmail = await UserModelClass.updateOne(
            {_id: new ObjectId(userId)},
            {$set:
                    {
                        password,
                        'emailConfirmation.confirmationCode': '+',
                        'emailConfirmation.expirationDate': null,
                        'emailConfirmation.isConfirmed': true}
            });

        return updateEmail.matchedCount === 1;
    }

    async updateUserToEmailConf(id: string) {
        const updateEmail = await UserModelClass.updateOne(
            {_id: new ObjectId(id)},
            {$set:
                    {
                        'emailConfirmation.confirmationCode': '+',
                        'emailConfirmation.expirationDate': null,
                        'emailConfirmation.isConfirmed': true}
            });

        return updateEmail.matchedCount === 1;
    }

    async updateUserToCodeAndDate(userId: ObjectId, code: string, expirationDate: Date) {
        const updateEmail = await UserModelClass.updateOne(
            {_id: userId},
            {$set:
                    {
                        'emailConfirmation.confirmationCode': code,
                        'emailConfirmation.expirationDate': expirationDate,
                        'emailConfirmation.isConfirmed': false}
            });

        return updateEmail.matchedCount === 1;
    }

    async deleteUser(id: string) {
        const result =  await UserModelClass.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async findUserById(userId: ObjectId){
        const user = await UserModelClass.findOne({_id: userId});
        if (!user){
            return;
        }
        return user;
    }
    async findUserByLogin(login: string) {
    }

    async findUserByEmail(email: string) {
        const user = await UserModelClass.findOne({email});
        if (!user){
            return;
        }
        return user;
    }

    async findUserByLoginOrEmail(loginOrEmail: string) {
        const filter = {
            $or: [
                {login: loginOrEmail} ,
                {email: loginOrEmail}
            ]
        }

        const findUser = await UserModelClass.findOne(filter).lean();

        if (!findUser) {
            return;
        }

        return findUser;
    }

    async findUserCode(code: string) {
        const user = await UserModelClass.findOne({'emailConfirmation.confirmationCode': code});
        if (!user){
            return;
        }
        return user;
    }
}