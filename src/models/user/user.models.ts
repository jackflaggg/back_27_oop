import {UUID} from "node:crypto";
import {ObjectId, SortDirection} from "mongodb";

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

export interface userInterface {
    userId: ObjectId,
    userLogin: string,
    userEmail: string,
}