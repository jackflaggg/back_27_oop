import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import mongoose from "mongoose";

@ValidatorConstraint({ async: false })
class IdValidator implements ValidatorConstraintInterface {
    validate(id: string) {
        return mongoose.Types.ObjectId.isValid(id);
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'неверный айди';
    }
}

export function IsId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IdValidator,
        });
    };
}

export class IdDTO {
    @IsId()
    id: string
    constructor(id: string) {
        this.id = id;
    }
}