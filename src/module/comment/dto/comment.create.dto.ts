import {IsString} from "class-validator";
import {IsTrimmed} from "../../../common/utils/validators/isTrim.validator";
import {IsStatuses} from "../../../common/utils/validators/status.validator";

export class CommentCreateDto {
    @IsTrimmed({ message: 'Объект пуст' })
    @IsString({ message: 'Не указано имя'})
    @IsStatuses({message: 'Неверные данные, нужно указать: None, Like, Dislike'})
    content: string;
    constructor(content: string) {
        this.content = content;
    }
}