import {UsersDbRepository} from "../../repositories/users/users.db.repository";
import {UserCreateDto} from "../../dto/user/user.create.dto";
import {User} from "../../dto/user/user.entity";
import {SETTINGS} from "../../settings";
import {ObjectId} from "mongodb";
import {transformUserToOut} from "../../utils/features/mappers/user.mapper";
import {ThrowError} from "../../utils/errors/custom.errors";
import {nameErr} from "../../models/common";

export class UserService {
    constructor(private readonly usersRepository: UsersDbRepository){}
    async createUser(dto: UserCreateDto){
        const user = new User(dto.login, dto.email);

        await user.setPassword(dto.password, SETTINGS.SALT);

        const existUser = user.mappingUserCreateAdmin();

        const newUser = await this.usersRepository.createUser(existUser);

        const date = await this.validateUser(newUser[0]._id);

        return transformUserToOut(date)

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
