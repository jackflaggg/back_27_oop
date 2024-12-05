import {
    registerDecorator, ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { Model } from 'mongoose';

@ValidatorConstraint({ async: false })
class IsUniqueValidator implements ValidatorConstraintInterface {

    constructor(private model: Model<any>){}

    async validate(value: any, args: ValidationArguments){
        if (!value) return true;

        const model = args.constraints[0];

        return model.countDocuments({ [args.property]: value }).then((count: number) => count === 0);
    }
    defaultMessage(args: any): string {
        return `${args.property} должно быть уникальным!!!!`;
    }
}

export function IsUnique(model: Model<any>, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isUnique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsUniqueValidator,
            constraints: [model]
        });
    };
}