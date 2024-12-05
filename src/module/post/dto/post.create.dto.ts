import {IsString, MaxLength} from "class-validator";
import {IsTrimmed} from "../../../common/utils/validators/isTrim.validator";

export class PostCreateDto {
    @IsTrimmed({ message: 'Объект пуст' })
    @IsString({ message: 'Не указано имя'})
    @MaxLength(30, { message: 'Длина больше 30'})
    title: string;

    @IsTrimmed({ message: 'Объект пуст'})
    @IsString({ message: 'Не указано описание' })
    @MaxLength(100, { message: 'Длина больше 100'})
    shortDescription: string;

    @IsTrimmed({ message: 'Объект пуст'})
    @IsString({ message: 'Не указан сайт' })
    @MaxLength(1000, { message: 'Длина больше 1000'})
    content: string;

    @IsTrimmed({ message: 'Объект пуст'})
    @IsString({ message: 'Не указан блог' })
    blogId: string;

    constructor(title: string, shortDescription: string, content: string, blogId: string) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
        this.blogId = blogId;
    }
}

export class PostCreateDtoLessBlogId {
    @IsTrimmed({ message: 'Объект пуст' })
    @IsString({ message: 'Не указано имя'})
    @MaxLength(30, { message: 'Длина больше 30'})
    title: string;

    @IsTrimmed({ message: 'Объект пуст'})
    @IsString({ message: 'Не указано описание' })
    @MaxLength(100, { message: 'Длина больше 100'})
    shortDescription: string;

    @IsTrimmed({ message: 'Объект пуст'})
    @IsString({ message: 'Не указан сайт' })
    @MaxLength(1000, { message: 'Длина больше 1000'})
    content: string;

    constructor(title: string, shortDescription: string, content: string/*, blogId: string*/) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
    }
}