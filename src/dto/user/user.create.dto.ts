import {IsTrimmed} from "../../utils/validators/isTrim.validator";
import {IsString, Length, Matches, MaxLength} from "class-validator";
import {IsUnique} from "../../utils/validators/isUnique.validator";
import {UserModelClass} from "../../db/db";

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