import {UserModelClass} from "../../db/db";
import {ObjectId} from "mongodb";

export class UsersDbRepository {
    constructor(){}
    async createUser(entity: any){
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

    async findUserByLogin(login: string) {
    }

    async findUserByEmail(email: string) {
    }

    async findUserByLoginOrEmail(loginOrEmail: string) {

    }

    async findUserCode(code: string) {

    }
}