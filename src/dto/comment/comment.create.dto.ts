import {IsString, Length} from "class-validator";
import {IsTrimmed} from "../../utils/validators/isTrim.validator";

export class CommentCreateDto {
    @IsTrimmed({ message: 'Объект пуст' })
    @IsString({ message: 'Не указано имя'})
    @Length(20, 300, { message: 'Длина меньше 20 или больше 300 символов'})
    content: string;
    constructor(content: string) {
        this.content = content;
    }
}