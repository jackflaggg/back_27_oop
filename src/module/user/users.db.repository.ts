import {UserModelClass} from "../../common/database";
import {ObjectId} from "mongodb";
import {
    createUserInterface, findUserByEmailInterface, findUserByLoginOrEmailInterface, transformCreateUserInterface,
    transformUserToLoginInterface,
    transformUserToOutInterface,
    userDbRepoInterface
} from "../../models/user/user.models";
import {
    transformUserToCode,
    transformUserToCreate,
    transformUserToEmail,
    transformUserToLogin, transformUserToLoginOrEmail,
    transformUserToOut
} from "../../common/utils/mappers/user.mapper";
import {injectable} from "inversify";

@injectable()
export class UsersDbRepository implements userDbRepoInterface{
    async createUser(entity: createUserInterface): Promise<transformCreateUserInterface>{
        const data =  await UserModelClass.insertMany([
            entity
        ]);
        return transformUserToCreate(data[0]);
    }

    async updateUserToPass(userId: string, password: string): Promise<boolean>{
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

    async updateUserToEmailConf(id: string): Promise<boolean> {
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

    async updateUserToCodeAndDate(userId: ObjectId, code: string, expirationDate: Date): Promise<boolean> {
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

    async deleteUser(id: string): Promise<boolean> {
        const result =  await UserModelClass.deleteOne({_id: new ObjectId(id)});
        return result.deletedCount === 1;
    }

    async findUserById(userId: ObjectId): Promise<void | transformUserToOutInterface>{
        const user = await UserModelClass.findOne({_id: userId});
        if (!user){
            return;
        }
        return transformUserToOut(user);
    }

    async findUserByUserId(userId: string): Promise<void | transformUserToLoginInterface>{
        const user = await UserModelClass.findOne({_id: new ObjectId(userId)});
        if (!user){
            return;
        }
        return transformUserToLogin(user);
    }

    async findUserByEmail(email: string): Promise<void | findUserByEmailInterface> {
        const user = await UserModelClass.findOne({email});
        if (!user){
            return;
        }
        return transformUserToEmail(user);
    }

    async findUserByLoginOrEmail(loginOrEmail: string): Promise<void | findUserByLoginOrEmailInterface> {
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

        return transformUserToLoginOrEmail(findUser);
    }

    async findUserCode(code: string): Promise<void | Omit<findUserByEmailInterface, 'login'>> {
        const user = await UserModelClass.findOne({'emailConfirmation.confirmationCode': code});
        if (!user){
            return;
        }
        return transformUserToCode(user);
    }
}