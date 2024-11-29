import {IsTrimmed} from "../../utils/validators/isTrim.validator";
import {IsString, Matches, MaxLength} from "class-validator";

export class BlogUpdateDto {
    @IsTrimmed({message: 'Объект пуст'})
    @IsString({ message: 'Не указано имя'})
    @MaxLength(15, { message: 'Длина больше 15 символов'})
    name: string;

    @IsTrimmed({message: 'Объект пуст'})
    @IsString({ message: 'Не указано описание' })
    @MaxLength(500, { message: 'Длина больше 500 символов'})
    description: string;

    @IsTrimmed({message: 'Объект пуст'})
    @IsString({ message: 'Не указан сайт' })
    @MaxLength(100, { message: 'Длина больше 100 символов'})
    @Matches(new RegExp('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'), { message: 'Неверно указан урл сайта'})
    websiteUrl: string;

    constructor(name: string, description: string, websiteUrl: string) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
    }
}