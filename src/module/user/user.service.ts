import {SETTINGS} from "../../common/config/settings";
import {ObjectId} from "mongodb";
import {nameErr} from "../../models/common";
import {UserCreateDto} from "./dto/user.create.dto";
import {User} from "./dto/user.entity";
import {UsersDbRepository} from "./users.db.repository";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {transformUserToOutInterface, userServiceInterface} from "../../models/user/user.models";
import {inject, injectable} from "inversify";
import {TYPES} from "../../models/types/types";

@injectable()
export class UserService implements userServiceInterface {
    constructor(@inject(TYPES.UserDbRepo) readonly usersRepository: UsersDbRepository){}
    async createUser(dto: UserCreateDto): Promise<transformUserToOutInterface | void>{
        const user = new User(dto.login, dto.email);

        await user.setPassword(dto.password, SETTINGS.SALT);

        const existUser = user.mappingUserCreateAdmin();

        const newUser = await this.usersRepository.createUser(existUser);

        return await this.validateUser(new ObjectId(newUser.id));


    }
    async deleteUser(userId: string): Promise<boolean>{
        await this.validateUser(new ObjectId(userId));

        return await this.usersRepository.deleteUser(userId);

    }
    async validateUser(userId: ObjectId): Promise<transformUserToOutInterface | void>{
        const user = await this.usersRepository.findUserById(userId);

        if(!user){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'юзер не найден!', field: 'UsersDBRepository'}]);
        }

        return user;
    }
}
