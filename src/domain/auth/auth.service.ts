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
import {PasswordRecoveryDbRepository} from "../../repositories/password-recovery/password-rec.db.repository";
import {UserModelClass} from "../../db/db";

export class AuthService {
    constructor(private logger: LoggerService, private readonly userDbRepository: UsersDbRepository, private readonly recoveryRepository: PasswordRecoveryDbRepository){}
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
        // специальная проверка для разных эндпоинтов на то, что этот код можно использовать
        // что этот код можно использовать в разных эндпоинтах

        const recCode = await this.recoveryRepository.findRecoveryCodeUser(dto.code);

        if (recCode){
            throw new ThrowError(nameErr['BAD_REQUEST'], [{message: 'этот код предназначен для new-password', field: 'AuthService'}])
        }

        const findCode = await this.userDbRepository.findUserCode(dto.code);

        // поиск юзера
        if (!findCode || (findCode.emailConfirmation && dto.code !== findCode.emailConfirmation.confirmationCode)){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'юзер не найден', field: 'UserDbRepository'}]);
        }

        // проверка на истекание кода
        if (findCode.emailConfirmation!.expirationDate !== null && !findCode.emailConfirmation!.isConfirmed) {

            const currentDate = new Date();
            const expirationDate = new Date(findCode.emailConfirmation!.expirationDate as Date );

            if (expirationDate < currentDate) {
                throw new ThrowError(nameErr['BAD_REQUEST'], [{message: 'код протух, переобновись', field: 'expirationDate'}]);
            }
        }

        // проверка на подтверждение регистрации
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

            const user = new User(login, dto.email);

            await user.setPassword('', 0);

            const mappingUser = user.mappingUserCreateClient();

            const newUser = await this.userDbRepository.createUser(mappingUser);

            await this.recoveryRepository.createCodeAndDateConfirmation(
                newUser[0]._id,
                String(newUser[0].emailConfirmation!.confirmationCode),
                newUser[0].emailConfirmation!.expirationDate!);
        } else {
            // если существует, то обновляем ему emailConf в юзербд + создаем запись в пассвордбд
            const generateCode = randomUUID();

            const newExpirationDate = add(new Date(), {
                hours: 1, minutes: 30
            });

            await this.userDbRepository.updateUserToCodeAndDate(findUser._id, generateCode, newExpirationDate);

            await this.recoveryRepository.createCodeAndDateConfirmation(findUser._id, generateCode, newExpirationDate);

            emailManagers.sendPasswordRecoveryMessage(findUser.email!, generateCode)
                .then(async (email) => {
                    await this.userDbRepository.deleteUser(String(findUser._id));
                })
                .catch(async (err: unknown) => {
                    await this.userDbRepository.deleteUser(String(findUser._id));
                    this.logger.error(err);
                })
        }

    }

    async newPassword(){}

    async emailResending() {}
}