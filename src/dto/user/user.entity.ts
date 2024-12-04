import {compare, genSalt, hash} from "bcrypt";
import {randomUUID} from "node:crypto";
import {add} from "date-fns/add";

export class User {
    private _createdAt: Date;
    private _password: string | undefined;

    constructor(private readonly _login: string, private readonly _email: string) {
        this._createdAt = new Date();
    }

    get email(): string{
        return this._email;
    }

    get login(): string{
        return this._login;
    }

    get password(): string {
        return String(this._password);
    }

    get createdAt() {
        return this._createdAt;
    }

    public async setPassword(password: string, salt: number): Promise<void> {
        const saltRound = await genSalt(salt);
        console.log(saltRound)
        this._password = await hash(password, saltRound);
    }

    public async comparePassword(pass: string, hash: string): Promise<boolean> {
        return await compare(pass, hash);
    }

    public mappingUserCreateAdmin(){
        return {
            login: this.login,
            email: this.email,
            password: this.password,
            createdAt: this.createdAt,
            emailConfirmation: {
                confirmationCode: '+',
                expirationDate: null,
                isConfirmed: true
            }
        }
    }

    public mappingUserCreateClient(){
        return {
            login: this.login,
            email: this.email,
            password: this.password,
            createdAt: this.createdAt,
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {hours: 1, minutes: 30, seconds: 10}),
                isConfirmed: false
            }
        }
    }
}