import {UUID} from "node:crypto";
import {SortDirection} from "mongodb";

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

export type InQueryUserModel = {
    sortBy?: string,
    sortDirection?: SortDirection,
    pageNumber?: number,
    pageSize?: number,
    searchLoginTerm?: string | null,
    searchEmailTerm?: string | null,
}