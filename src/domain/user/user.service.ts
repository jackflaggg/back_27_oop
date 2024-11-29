import {UsersDbRepository} from "../../repositories/users/users.db.repository";
import {UserCreateDto} from "../../dto/user/user.create.dto";
import {User} from "../../dto/user/user.entity";
import {SETTINGS} from "../../settings";

export class UserService {
    constructor(private readonly usersRepository: UsersDbRepository){}
    async createUser(dto: UserCreateDto){
        const user = new User(dto.login, dto.email);

        await user.setPassword(dto.password, SETTINGS.SALT);

        const existUser = user.mappingUserCreateAdmin();

        const newUser = await this.usersRepository.createUser(existUser);

        return await this.usersRepository.findUserById(newUser);

    }
    async deleteUser(userId: string){

    }
}
