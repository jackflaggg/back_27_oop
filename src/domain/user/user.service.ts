import {UsersDbRepository} from "../../repositories/users/users.db.repository";

export class UserService {
    constructor(private readonly usersRepository: UsersDbRepository){}

}
