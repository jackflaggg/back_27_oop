import {IsString, Length, Matches, MaxLength} from "class-validator";
import {IsTrimmed} from "../../../common/utils/validators/isTrim.validator";

export class CodeFindDto {
    @IsString({ message: 'Не указан code'})
    @Length(36, 36, {message: 'неверный код!'})
    code: string;
    constructor(code: string) {
        this.code = code;
    }
}

export class EmailFindDto {
    @IsTrimmed({message: 'Объект пуст'})
    @IsString({ message: 'Не указан сайт' })
    @MaxLength(100, { message: 'Длина больше 100 символов'})
    @Matches(new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'), { message: 'Неверно указан email'})
    email: string;
    constructor(email: string) {
        this.email = email;
    }
}

export class PasswordAndCodeDto {
    @IsString({ message: 'Не указан code'})
    @Length(36, 36, {message: 'неверный код!'})
    recoveryCode: string;

    @IsString({ message: 'Не указан code'})
    @Length(6, 20, {message: 'ваш пароль должен быть больше 5 символов и меньше 21'})
    newPassword: string;
    constructor(newPassword: string, code: string) {
        this.newPassword = newPassword;
        this.recoveryCode = code;
    }
}