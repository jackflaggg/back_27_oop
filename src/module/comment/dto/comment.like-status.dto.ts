import {IsString} from "class-validator";
import {IsTrimmed} from "../../../common/utils/validators/isTrim.validator";

export class CommentStatus {
    @IsTrimmed({ message: 'Объект пуст' })
    @IsString({ message: 'Не указано имя'})
    likeStatus: string;
    constructor(status: string){
        this.likeStatus = status;
    }
}