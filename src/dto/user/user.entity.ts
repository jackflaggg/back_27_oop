import {compare, genSalt, hash} from "bcrypt";

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

        this._password = await hash(password, saltRound);
    }

    public async comparePassword(pass: string, hash: string): Promise<boolean> {
        return await compare(pass, hash);
    }

    public mappingUserCreateAdmin(login: string, email: string){
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
}