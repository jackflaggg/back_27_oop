import {UserModelClass} from "../../db/db";

export class UsersDbRepository {
    constructor(){}
    async createUser(entity: any){
        const user = await UserModelClass.insertMany([
            entity
        ]);
        return user[0].id;
    }

    async updateUserToPass(userId: string, password: string){

    }

    async updateUserToEmailConf(id: string, code: string) {

    }

    async updateUserToCodeAndDate(userId: string, code: string, expirationDate: Date) {

    }

    async deleteUser(id: string) {

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