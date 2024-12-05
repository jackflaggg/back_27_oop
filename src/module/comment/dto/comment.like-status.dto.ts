import {IsString} from "class-validator";
import {IsTrimmed} from "../../../common/utils/validators/isTrim.validator";
import {IsStatuses} from "../../../common/utils/validators/status.validator";

export class CommentStatus {
    @IsTrimmed({ message: 'Объект пуст' })
    @IsString({ message: 'Не указано имя'})
    @IsStatuses({message: 'Неверные данные, нужно указать: None, Like, Dislike'})
    likeStatus: string;
    constructor(status: string){
        this.likeStatus = status;
    }
}