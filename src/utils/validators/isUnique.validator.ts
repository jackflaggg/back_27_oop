import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { Model } from 'mongoose';

@ValidatorConstraint({ async: false })
class IsUniqueValidator implements ValidatorConstraintInterface {
    constructor(private model: Model<any>){}

    async validate(value: any, args: any){
        if (!value) return true;
        const countUnique = await this.model.countDocuments({ [args.property]: value });
        return countUnique === 0;
    }
    defaultMessage(args: any): string {
        return `${args.property} должно быть уникальным!!!!`;
    }
}

export function IsUnique(model: Model<any>, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isTrimmed',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsUniqueValidator,
            constraints: [model]
        });
    };
}