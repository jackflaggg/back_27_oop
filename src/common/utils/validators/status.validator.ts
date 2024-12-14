import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

const arrayStatuses = [ 'None', 'Like', 'Dislike' ];

@ValidatorConstraint({ async: false })
class IsStatus implements ValidatorConstraintInterface {
    // если строка проходит по regex, то это email
    // иначе это логин
    async validate(value: any, args: ValidationArguments){
        return arrayStatuses.includes(value);

    }
    defaultMessage(args: any): string {
        return `${args.property} Вы передаете неверный статус!`;
    }
}

export function IsStatuses(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsStatuses',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsStatus,
        });
    };
}