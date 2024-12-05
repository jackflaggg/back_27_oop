import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ async: false })
class IsStatus implements ValidatorConstraintInterface {
    // если строка проходит по regex, то это email
    // иначе это логин
    async validate(value: any, args: ValidationArguments){
        return true;

    }
    defaultMessage(args: any): string {
        return `${args.property} Вы передаете неверный статус!`;
    }
}

export function IsLoginOrEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isIsLoginOrEmail',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsStatus,
        });
    };
}