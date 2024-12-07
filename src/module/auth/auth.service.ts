import {PasswordRecoveryDbRepository} from "./password-rec.db.repository";
import {SecurityService} from "../security/security.service";
import {LoginDto, UserCreateDto} from "../user/dto/user.create.dto";
import {User} from "../user/dto/user.entity";
import {SETTINGS} from "../../common/config/settings";
import {CodeFindDto, EmailFindDto, PasswordAndCodeDto} from "./dto/code.dto";
import {nameErr} from "../../models/common";
import {randomUUID} from "node:crypto";
import {add} from "date-fns/add";
import bcrypt from "bcrypt";
import {Session} from "../security/dto/create.session";
import {RefreshDto} from "./dto/refresh.dto";
import {UsersDbRepository} from "../user/users.db.repository";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {ThrowError} from "../../common/utils/errors/custom.errors";
import {GenerateTokens} from "../../common/utils/features/generate.tokens";
import {LoggerService} from "../../common/utils/integrations/logger/logger.service";
import {emailManagers} from "../../common/utils/integrations/email/email.manager";
import {ObjectId} from "mongodb";
import {loginInterface, transformUserToLoginInterface} from "../../models/user/user.models";
import {injectable} from "inversify";

@injectable()
export class AuthService {
    constructor(private logger: LoggerService,
                private readonly userDbRepository: UsersDbRepository,
                private readonly recoveryRepository: PasswordRecoveryDbRepository,
                private readonly jwtService: JwtStrategy,
                private readonly securityService: SecurityService){}
    async registrationUser(userDto: UserCreateDto): Promise<void> {
        const user = new User(userDto.login, userDto.email);

        await user.setPassword(userDto.password, SETTINGS.SALT);

        const newUser = user.mappingUserCreateClient();

        const createUser = await this.userDbRepository.createUser(newUser);

        const {email: userEmail, emailConfirmation: {confirmationCode}} = newUser;

        emailManagers.sendEmailRecoveryMessage(userEmail, confirmationCode)
            .then(async (existingSendEmail) => {
                if (!existingSendEmail) {
                    await this.userDbRepository.deleteUser(String(createUser.id));
                }
            })
            .catch(async (e) => {
                this.logger.error(e);
                await this.userDbRepository.deleteUser(String(createUser.id));
            })
    }

    async registrationConfirmation(dto: CodeFindDto): Promise<boolean>{
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

        return await this.userDbRepository.updateUserToEmailConf(findCode.id);
    }

    async passwordRecovery(dto: EmailFindDto): Promise<void>{
        const findUser = await this.userDbRepository.findUserByEmail(dto.email);

        if (!findUser) {
            // если пользователя не существует, то мы его регаем!
            const login = dto.email.substring(0, dto.email.indexOf('@'))

            const user = new User(login, dto.email);

            await user.setPassword('', 0);

            const mappingUser = user.mappingUserCreateClient();

            const newUser = await this.userDbRepository.createUser(mappingUser);

            await this.recoveryRepository.createCodeAndDateConfirmation(
                new ObjectId(newUser.id),
                String(newUser.emailConfirmation!.confirmationCode),
                newUser.emailConfirmation!.expirationDate);

            emailManagers.sendPasswordRecoveryMessage(dto.email, mappingUser.emailConfirmation.confirmationCode)
                .then(async (email) => {
                    if (!email){
                        await this.userDbRepository.deleteUser(String(newUser.id));
                    }
                })
                .catch(async (err: unknown) => {
                    await this.userDbRepository.deleteUser(String(newUser.id));
                    this.logger.error(err);
                })
        } else {
            // если существует, то обновляем ему emailConf в юзербд + создаем запись в пассвордбд
            const generateCode = randomUUID();

            const newExpirationDate = add(new Date(), {
                hours: 1, minutes: 30
            });

            await this.userDbRepository.updateUserToCodeAndDate(new ObjectId(findUser.id), generateCode, newExpirationDate);

            await this.recoveryRepository.createCodeAndDateConfirmation(new ObjectId(findUser.id), generateCode, newExpirationDate);

            emailManagers.sendPasswordRecoveryMessage(findUser.email!, generateCode)
                .then(async (email) => {
                    if (!email){
                        await this.userDbRepository.deleteUser(String(findUser.id));
                    }
                })
                .catch(async (err: unknown) => {
                    await this.userDbRepository.deleteUser(String(findUser.id));
                    this.logger.error(err);
                })
        }

    }

    async newPassword(dto: PasswordAndCodeDto): Promise<void> {
        const findCode = await this.recoveryRepository.findRecoveryCodeUser(dto.recoveryCode);

        if (!findCode){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'произошла непредвиденная ошибка, код не найден', field: 'AuthService'}]);
        }

        if (findCode.used){
            throw new ThrowError(nameErr['BAD_REQUEST'], [{message: 'данный код активации был уже использован, попробуйте повторить попытку', field: 'AuthService'}]);
        }

        const salt = await bcrypt.genSalt(SETTINGS.SALT);
        const hash = await bcrypt.hash(dto.newPassword, salt)

        await this.recoveryRepository.updateStatus(new ObjectId(findCode.id));
        await this.userDbRepository.updateUserToPass(findCode.userId, hash);
    }

    async emailResending(dto: EmailFindDto): Promise<void> {
        const user = await this.userDbRepository.findUserByEmail(dto.email);

        if (!user){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'произошла непредвиденная ошибка, юзер не найден', field: 'AuthService'}]);
        }

        if (user.emailConfirmation.isConfirmed){
            throw new ThrowError(nameErr['BAD_REQUEST'], [{message: 'аккаунт уже был активирован!', field: 'AuthService'}]);
        }
        const generateCode = randomUUID();

        const newExpirationDate = add(new Date(), {
            hours: 1,
            minutes: 30
        })
        await this.userDbRepository.updateUserToCodeAndDate(new ObjectId(user.id), generateCode, newExpirationDate);

        emailManagers.sendEmailRecoveryMessage(user.email, generateCode)
            .then(async (email) => {
                if (!email){
                    await this.userDbRepository.deleteUser(String(user.id));
                }
            })
            .catch(async (err: unknown) => {
                this.logger.error(String(err))
            })
    }

    async login(dto: LoginDto): Promise<loginInterface> {
        const userId = await this.authUser(dto);

        const deviceId = randomUUID();

        const token = new GenerateTokens(this.jwtService, userId, deviceId);

        const generate = await token.generateTokens();

        const decodeRefreshToken = await this.jwtService.decodeToken(generate.refresh!);

        if (!decodeRefreshToken){
            throw new ThrowError(nameErr['NOT_AUTHORIZATION']);
        }

        const dateDevices = new Date(Number(decodeRefreshToken.iat) * 1000);

        await this.securityService.createSession(new Session(dto.ip, dto.userAgent, deviceId, userId, dateDevices, generate.refresh!));

        return {
            jwt: generate.access,
            refresh: generate.refresh
        }
    }

    async authUser(dto: LoginDto): Promise<string> {
        // идентификация - проверка на то, что такой юзер есть
        const findUser = await this.userDbRepository.findUserByLoginOrEmail(dto.loginOrEmail);

        if (!findUser){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'идентификация юзера не удалась', field: 'AuthService'}]);
        }

        const checkPassword = await bcrypt.compare(dto.password, String(findUser.password));

        if (!checkPassword){
            throw new ThrowError(nameErr['NOT_FOUND'], [{message: 'аутентификация не удалась', field: 'AuthService'}]);
        }

        return findUser.id;
    }

    async updateRefreshToken(dto: RefreshDto): Promise<loginInterface>{
        const res = await this.jwtService.decodeToken(dto.refreshToken);

        if (!res){
            throw new ThrowError(nameErr['NOT_AUTHORIZATION'])
        }

        const {userId, deviceId, iat, exp} = res;

        const result = await this.securityService.findToken(new Date(Number(iat)* 1000), deviceId);

        if (!result){
            throw new ThrowError(nameErr['NOT_AUTHORIZATION']);
        }

        const token = new GenerateTokens(this.jwtService, userId, deviceId);

        const generate = await token.generateTokens();

        await this.securityService.updateSession(result._id, result.issuedAt!, generate.refresh!);

        return {
            jwt: generate.access,
            refresh: generate.refresh
        }
    }

    async deleteSessionBeRefreshToken(dto: RefreshDto): Promise<boolean> {
        const result = await this.securityService.deleteSessionByRefreshToken(dto.refreshToken);
        if (!result){
            throw new ThrowError(nameErr['NOT_AUTHORIZATION']);
        }
        return result;
    }

    async meInfo(dto: RefreshDto): Promise<void | transformUserToLoginInterface>{
        const decoded = await this.jwtService.decodeToken(dto.refreshToken);
        if (!decoded){
            throw new ThrowError(nameErr['NOT_AUTHORIZATION']);
        }
        return await this.userDbRepository.findUserByUserId(decoded.userId);

    }
}