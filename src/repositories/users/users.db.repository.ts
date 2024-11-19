import {ObjectId, WithId} from "mongodb";
import {UserDbType} from "../../models/db/db.models";
import {OutUserFindLoginOrEmail, OutUserServiceModel} from "../../models/user/ouput/output.type.users";
import {UserModelClass} from "../../db/db";

export const UsersDbRepository = {
    async createUser(body: OutUserServiceModel): Promise<string | null> {
        const newUser = await UserModelClass.insertMany(body)

        if (!newUser[0]._id) {
            return null;
        }
        return newUser[0]._id.toString();
    },
    async deleteUser(id: string): Promise<boolean> {
        const deleteUser = await UserModelClass.deleteOne({_id: new ObjectId(id)});
        return deleteUser.acknowledged;
    },
    async findByLoginUser(login: string): Promise<any | null> {
        const searchUser = await UserModelClass.find({login}).lean();
        if (!searchUser[0]) {
            return null;
        }
        return searchUser[0];
    },
    async findByEmailUser(email: string): Promise<any | null> {
        const searchEmail =  await UserModelClass.find({ email: email }).lean();

        if (!searchEmail[0]._id) {
            return null;
        }

        return searchEmail[0];
    },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<null | any> {

        const filter = {
            $or: [
                {login: loginOrEmail} ,
                {email: loginOrEmail}
            ]
        }
        const findUser = await UserModelClass.find(filter).lean();
        if (!findUser[0]._id) {
            return null;
        }
        return findUser[0];
    },
    async findCodeUser(code: string): Promise<any | null> {

        const findUser = await UserModelClass.find({
            'emailConfirmation.confirmationCode': code
        }).lean();

        if (!findUser[0]._id){
            console.log('[UsersDbRepository] не нашел юзера!')
            return null;
        }

        return findUser[0];
    },
    async updateEmailConfirmation(id: string, code: string): Promise<boolean> {
        const updateEmail = await UserModelClass.updateOne(
            {_id: new ObjectId(id)},
            {$set: {'emailConfirmation.confirmationCode': code, 'emailConfirmation.expirationDate': null, 'emailConfirmation.isConfirmed': true}});

        const {acknowledged, modifiedCount} = updateEmail;

        return acknowledged && Boolean(modifiedCount);
    },
    async updateCodeAndDateConfirmation(userId: string, code: string, expirationDate: Date) {
        const result = await UserModelClass.updateOne(
            {_id: new ObjectId(userId)},
            {
                $set: {
                    'emailConfirmation.confirmationCode': code,
                    'emailConfirmation.expirationDate': expirationDate
                }
            }
        )

        const {acknowledged, modifiedCount} = result;
        return acknowledged && Boolean(modifiedCount);
    }
}