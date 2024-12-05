import {
    registerDecorator,
    ValidationArguments, ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";

@ValidatorConstraint({ async: false })
class TrimValidator implements ValidatorConstraintInterface {
    validate(entity: any){
        return typeof entity === 'string' ? entity.trim().length > 0 : false;
    }
    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Либо передали пробелы, либо тут пусто';
    }
}

export function IsTrimmed(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isTrimmed',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: TrimValidator,
        });
    };
}