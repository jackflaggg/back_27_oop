import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const loginRegex = /^[a-zA-Z0-9.-]+$/;

@ValidatorConstraint({ async: false })
class IsLoginOrEmailValidator implements ValidatorConstraintInterface {
    // если строка проходит по regex, то это email
    // иначе это логин
    async validate(value: any, args: ValidationArguments){
        if (typeof value !== 'string' || value.trim() === '') {
            return false;
        }

        const trimmedValue = value.trim();

        if (trimmedValue.length < 3) {
            return false;
        }

        if (trimmedValue.includes('@')) {
            return emailRegex.test(trimmedValue);
        }

        return loginRegex.test(trimmedValue);

    }
    defaultMessage(args: any): string {
        return `${args.property} данные невалидны !`;
    }
}

export function IsLoginOrEmail(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isIsLoginOrEmail',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsLoginOrEmailValidator,
        });
    };
}