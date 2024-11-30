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

    }

    async updateUserToEmailConf(id: string, code: string) {

    }

    async updateUserToCodeAndDate(userId: string, code: string, expirationDate: Date) {

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
    }

    async findUserByLoginOrEmail(loginOrEmail: string) {

    }

    async findUserCode(code: string) {
        const user = await UserModelClass.findOne({'emailConfirmation.confirmationCode': code});
        if (!user){
            return;
        }
        return user;
    }
}