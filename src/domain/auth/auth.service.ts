import {UserCreateDto} from "../../dto/user/user.create.dto";
import {User} from "../../dto/user/user.entity";
import {SETTINGS} from "../../settings";
import {emailManagers} from "../../managers/email.manager";
import {UsersDbRepository} from "../../repositories/users/users.db.repository";

export class AuthService {
    constructor(private readonly userDbRepository: UsersDbRepository){}
    async registrationUser(userDto: UserCreateDto) {
        const user = new User(userDto.login, userDto.email);

        await user.setPassword(userDto.password, SETTINGS.SALT);

        const newUser = user.mappingUserCreateClient();

        const createUser = await this.userDbRepository.createUser(newUser);

        const {email: userEmail, emailConfirmation: {confirmationCode}} = newUser;

        emailManagers.sendEmailRecoveryMessage(userEmail, confirmationCode)
            .then(async (existingSendEmail) => {
                if (!existingSendEmail) {
                    await this.userDbRepository.deleteUser(String(createUser));
                }
            })
            .catch(async (e) => {
                console.log(String(e))
                await this.userDbRepository.deleteUser(String(createUser));
            })
    }
}