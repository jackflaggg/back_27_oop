import {LoginDto, UserCreateDto} from "../../dto/user/user.create.dto";
import {User} from "../../dto/user/user.entity";
import {SETTINGS} from "../../settings";
import {emailManagers} from "../../managers/email.manager";
import {UsersDbRepository} from "../../repositories/users/users.db.repository";
import {LoggerService} from "../../utils/logger/logger.service";
import {CodeFindDto, EmailFindDto, PasswordAndCodeDto} from "../../dto/auth/code.dto";
import {ThrowError} from "../../utils/errors/custom.errors";
import {nameErr} from "../../models/common";
import {randomUUID} from "node:crypto";
import {add} from "date-fns/add";
import {PasswordRecoveryDbRepository} from "../../repositories/password-recovery/password-rec.db.repository";
import {UserModelClass} from "../../db/db";
import bcrypt from "bcrypt";
import {JwtService} from "../../utils/jwt/jwt.service";
import {SecurityService} from "../security/security.service";
import {Session} from "../../dto/session/create.session";
import {GenerateTokens} from "../../utils/features/common/generate.tokens";
import {RefreshDto} from "../../dto/auth/refresh.dto";
import {decode} from "node:punycode";

export class AuthService {
    constructor(private logger: LoggerService,
                private readonly userDbRepository: UsersDbRepository,
                private readonly recoveryRepository: PasswordRecoveryDbRepository,
                private readonly jwtService: JwtService,
                private readonly securityService: SecurityService){}
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
                    if (!email){
                        await this.userDbRepository.deleteUser(String(findUser._id));
                    }
                })
                .catch(async (err: unknown) => {
                    await this.userDbRepository.deleteUser(String(findUser._id));
                    this.logger.error(err);
                })
        }

    }

    async newPassword(dto: PasswordAndCodeDto){
        const findCode = await this.recoveryRepository.findRecoveryCodeUser(dto.recoveryCode);

        if (!findCode){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'произошла непредвиденная ошибка, код не найден', field: 'AuthService'}]);
        }

        const salt = await bcrypt.genSalt(SETTINGS.SALT);
        const hash = await bcrypt.hash(dto.newPassword, salt)

        await this.userDbRepository.updateUserToPass(String(findCode._id), hash)
    }

    async emailResending(dto: EmailFindDto) {
        const user = await this.userDbRepository.findUserByEmail(dto.email);

        if (!user){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'произошла непредвиденная ошибка, юзер не найден', field: 'AuthService'}]);
        }

        if (user.emailConfirmation!.isConfirmed){
            throw new ThrowError(nameErr['BAD_REQUEST'], [{message: 'аккаунт уже был активирован!', field: 'AuthService'}]);
        }
        const generateCode = randomUUID();

        const newExpirationDate = add(new Date(), {
            hours: 1,
            minutes: 30
        })
        await this.userDbRepository.updateUserToCodeAndDate(user._id, generateCode, newExpirationDate);

        emailManagers.sendEmailRecoveryMessage(user.email!, generateCode)
            .then(async (email) => {
                if (!email){
                    await this.userDbRepository.deleteUser(String(user._id));
                }
            })
            .catch(async (err: unknown) => {
                this.logger.error(String(err))
            })
    }

    async login(dto: LoginDto){
        const userId = await this.authUser(dto);

        const deviceId = randomUUID();

        const token = new GenerateTokens(this.jwtService, userId, deviceId);

        const generate = await token.generateTokens();

        const decodeRefreshToken = await this.jwtService.decodeToken(generate.refresh);

        const dateDevices = new Date(Number(decodeRefreshToken.iat) * 1000);

        await this.securityService.createSession(new Session(dto.ip, dto.userAgent, deviceId, userId, dateDevices, generate.refresh));

        return {
            jwt: generate.access,
            refresh: generate.refresh
        }
    }

    async authUser(dto: LoginDto){
        // идентификация - проверка на то, что такой юзер есть
        const findUser = await this.userDbRepository.findUserByLoginOrEmail(dto.loginOrEmail);

        if (!findUser){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'идентификация юзера не удалась', field: 'AuthService'}]);
        }

        const checkPassword = await bcrypt.compare(dto.password, String(findUser.password));

        if (!checkPassword){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'аутентификация не удалась', field: 'AuthService'}]);
        }

        return findUser._id.toString();
    }

    async updateRefreshToken(dto: RefreshDto){
        const {userId, deviceId, iat, exp} = await this.jwtService.decodeToken(dto.refreshToken);

        const result = await this.securityService.findToken(new Date(Number(iat)* 1000), deviceId);

        if (!result){
            throw new ThrowError(nameErr['NOT_AUTHORIZATION']);
        }

        const token = new GenerateTokens(this.jwtService, userId, deviceId);

        const generate = await token.generateTokens();

        await this.securityService.updateSession(result._id, result.issuedAt!, generate.refresh);

        return {
            jwt: generate.access,
            refresh: generate.refresh
        }
    }

    async deleteSessionBeRefreshToken(dto: RefreshDto){
        const result = await this.securityService.deleteSessionByRefreshToken(dto.refreshToken);
        if (!result){
            throw new ThrowError(nameErr['NOT_AUTHORIZATION']);
        }
        return result;
    }
}