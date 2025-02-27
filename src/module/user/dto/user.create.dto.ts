import {IsString, Length, Matches, MaxLength} from "class-validator";
import {IsTrimmed} from "../../../common/utils/validators/isTrim.validator";
import {IsUnique} from "../../../common/utils/validators/isUnique.validator";
import {UserModelClass} from "../../../common/database";
import {IsLoginOrEmail} from "../../../common/utils/validators/login.email.validator";
import {SETTINGS} from "../../../common/config/settings";

export class UserCreateDto {
    @IsTrimmed({message: 'Объект пуст'})
    @IsString({ message: 'Не указано имя'})
    @Length(3, 10, { message: 'длина меньше 3 или больше 10'})
    @Matches(new RegExp('^[a-zA-Z0-9_-]*$'), { message: 'Неверно указан логин'})
    @IsUnique(UserModelClass, { message: 'должен быть уникальным!' })
    login: string;

    @IsTrimmed({message: 'Объект пуст'})
    @IsString({ message: 'Не указано описание' })
    @Length(6, 20, { message: 'длина меньше 6 или больше 20'})
    password: string;

    @IsTrimmed({message: 'Объект пуст'})
    @IsString({ message: 'Не указан сайт' })
    @MaxLength(100, { message: 'Длина больше 100 символов'})
    @Matches(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'), { message: 'Неверно указан email'})
    @IsUnique(UserModelClass, { message: 'должен быть уникальным!' })
    email: string;

    constructor(login: string, password: string, email: string) {
        this.login = login;
        this.password = password;
        this.email = email;
    }
}

export class LoginDto {
    @IsLoginOrEmail({ message: 'неверные данные'})
    loginOrEmail: string;

    @IsTrimmed({message: 'Объект пуст'})
    @IsString({ message: 'Не указано описание' })
    @Length(6, 20, { message: 'длина меньше 6 или больше 20'})
    password: string;

    ip: string;
    userAgent: string;
    constructor(loginOrEmail: string, password: string, ip: string = SETTINGS.ipTest!, userAgent: string = SETTINGS.userAgent!) {
        this.loginOrEmail = loginOrEmail;
        this.password = password;
        this.ip = ip;
        this.userAgent = userAgent;
    }
}