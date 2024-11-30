import {UserCreateDto} from "../../dto/user/user.create.dto";
import {User} from "../../dto/user/user.entity";
import {SETTINGS} from "../../settings";
import {emailManagers} from "../../managers/email.manager";
import {UsersDbRepository} from "../../repositories/users/users.db.repository";
import {LoggerService} from "../../utils/logger/logger.service";
import {CodeFindDto, EmailFindDto} from "../../dto/auth/code.dto";
import {ThrowError} from "../../utils/errors/custom.errors";
import {nameErr} from "../../models/common";
import {randomUUID} from "node:crypto";
import {add} from "date-fns/add";

export class AuthService {
    constructor(private logger: LoggerService, private readonly userDbRepository: UsersDbRepository){}
    async registrationUser(userDto: UserCreateDto) {
        const user = new User(userDto.login, userDto.email);

        await user.setPassword(userDto.password, SETTINGS.SALT);

        const newUser = user.mappingUserCreateClient();

        const createUser = await this.userDbRepository.createUser(newUser);

        const {email: userEmail, emailConfirmation: {confirmationCode}} = newUser;

        emailManagers.sendEmailRecoveryMessage(userEmail, confirmationCode)
            .then(async (existingSendEmail) => {
                if (!existingSendEmail) {
                    await this.userDbRepository.deleteUser(String(createUser[0]._id));
                }
            })
            .catch(async (e) => {
                this.logger.error(e);
                await this.userDbRepository.deleteUser(String(createUser[0]._id));
            })
    }

    async registrationConfirmation(dto: CodeFindDto){
        const findCode = await this.userDbRepository.findUserCode(dto.code);

        if (!findCode || (findCode.emailConfirmation && dto.code !== findCode.emailConfirmation.confirmationCode)){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'юзер не найден', field: 'UserDbRepository'}]);
        }

        if (findCode.emailConfirmation!.expirationDate !== null && !findCode.emailConfirmation!.isConfirmed) {

            const currentDate = new Date();
            const expirationDate = new Date(findCode.emailConfirmation!.expirationDate as Date );

            if (expirationDate < currentDate) {
                throw new ThrowError(nameErr['BAD_REQUEST'], [{message: 'код протух, переобновись', field: 'expirationDate'}]);
            }
        }

        if (findCode.emailConfirmation!.isConfirmed && findCode.emailConfirmation!.confirmationCode === '+') {
            throw new ThrowError(nameErr['BAD_REQUEST'], [{message: 'Подтверждение уже было', field: 'expirationDate'}]);
        }

        return await this.userDbRepository.updateUserToEmailConf(String(findCode._id));
    }

    async passwordRecovery(dto: EmailFindDto){
        const findUser = await this.userDbRepository.findUserByEmail(dto.email);

        if (!findUser) {
            // если пользователя не существует, то мы его регаем!
            const login = dto.email.substring(0, dto.email.indexOf('@'))

            await this.registrationUser({login, email: dto.email, password: ''});
        }

        const generateCode = randomUUID();

        const newExpirationDate = add(new Date(), {
            seconds: 55
        });


    }

    async newPassword(){}

    async emailResending() {}
}