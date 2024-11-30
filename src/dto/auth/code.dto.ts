import {IsString, Length} from "class-validator";

export class CodeFindDto {
    @IsString({ message: 'Не указан code'})
    @Length(36, 36, {message: 'неверный код!'})
    code: string;
    constructor(code: string) {
        this.code = code;
    }
}