import {UUID} from "node:crypto";

export interface emailInfo {
    confirmationCode: UUID | string,
    expirationDate: Date | null,
    isConfirmed: boolean
}

export interface createUserInterface {
    login: string,
    password: string,
    email: string,
    createdAt: Date,
    emailConfirmation: emailInfo
}
