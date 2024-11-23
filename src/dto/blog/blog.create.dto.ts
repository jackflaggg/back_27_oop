import {IsString} from "class-validator";

export class BlogCreateDto {
    @IsString({ message: 'Не указано имя'})
    name: string;

    @IsString({ message: 'Не указано описание' })
    description: string;

    @IsString({ message: 'Не указан сайт' })
    websiteUrl: string;

    constructor(name: string, description: string, websiteUrl: string) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
    }
}
