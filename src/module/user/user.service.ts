import {SETTINGS} from "../../common/config/settings";
import {ObjectId} from "mongodb";
import {nameErr} from "../../models/common";
import {UserCreateDto} from "./dto/user.create.dto";
import {User} from "./dto/user.entity";
import {UsersDbRepository} from "./users.db.repository";
import {ThrowError} from "../../common/utils/errors/custom.errors";

export class UserService {
    constructor(private readonly usersRepository: UsersDbRepository){}
    async createUser(dto: UserCreateDto){
        const user = new User(dto.login, dto.email);

        await user.setPassword(dto.password, SETTINGS.SALT);

        const existUser = user.mappingUserCreateAdmin();

        const newUser = await this.usersRepository.createUser(existUser);

        return await this.validateUser(newUser[0]._id);


    }
    async deleteUser(userId: string){
        await this.validateUser(new ObjectId(userId));

        return await this.usersRepository.deleteUser(userId);

    }
    async validateUser(userId: ObjectId){
        const user = await this.usersRepository.findUserById(userId);

        if(!user){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'юзер не найден!', field: 'UsersDBRepository'}]);
        }

        return user;
    }
}
