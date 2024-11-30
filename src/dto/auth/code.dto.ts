import {IsString, Length, Matches, MaxLength} from "class-validator";
import {IsTrimmed} from "../../utils/validators/isTrim.validator";

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