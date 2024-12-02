export class Session {
    constructor(protected id: string, protected nameDevice: string, protected userId: string, protected activeDate: Date, protected refreshToken: string) {}
}