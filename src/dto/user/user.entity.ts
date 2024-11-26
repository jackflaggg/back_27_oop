export class User {
    createdAt: Date;
    constructor(protected login: string, protected password: string, protected email: string) {
        this.createdAt = new Date();
    }
}