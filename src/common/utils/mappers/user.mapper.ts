import {ObjectId} from "mongodb";
import {FlattenMaps} from "mongoose";
import {UUID} from "node:crypto";
import {
    findUserByEmailInterface, findUserByLoginOrEmailInterface, transformCreateUserInterface,
    transformUserToLoginInterface,
    transformUserToOutInterface,
} from "../../../module/user/models/user.models";

export function transformUserToOut(value: FlattenMaps<
    {
            login?: string | null | undefined;
            password?: string | null | undefined;
            email?: string | null | undefined;
            createdAt?: Date | null | undefined;
            emailConfirmation?: {
                confirmationCode?: string | UUID | null;
                expirationDate?: Date | null | undefined;
                isConfirmed?: boolean | null | undefined;
            } | null | undefined;
            _id: ObjectId}>): transformUserToOutInterface {
        return {
                id: String(value._id),
                login: value.login || '',
                email: value.email || '',
                createdAt: value.createdAt || '',
        }
}

export function transformUserToLogin(value: FlattenMaps<
    {
        login?: string | null | undefined;
        password?: string | null | undefined;
        email?: string | null | undefined;
        createdAt?: Date | null | undefined;
        emailConfirmation?: {
            confirmationCode?: string | UUID | null;
            expirationDate?: Date | null | undefined;
            isConfirmed?: boolean | null | undefined;
        } | null | undefined;
        _id: ObjectId}>): transformUserToLoginInterface {
        return {
                email: value.email || '',
                login: value.login || '',
                userId: value._id || '',
        }
}

export function transformUserToCreate(value: FlattenMaps<
    {
        login?: string | null | undefined;
        password?: string | null | undefined;
        email?: string | null | undefined;
        createdAt?: Date | null | undefined;
        emailConfirmation?: {
            confirmationCode?: string | UUID | null;
            expirationDate?: Date | null | undefined;
            isConfirmed?: boolean | null | undefined;
        } | null | undefined;
        _id: ObjectId}>): transformCreateUserInterface {
    return {
        id: String(value._id),
        login: value.login || '',
        email: value.email || '',
        createdAt: value.createdAt || '',
        emailConfirmation: {
            confirmationCode: value.emailConfirmation?.confirmationCode || '',
            expirationDate: value.emailConfirmation?.expirationDate || new Date(0),
            isConfirmed: value.emailConfirmation?.isConfirmed || false,
        }
    }
}

export function transformUserToEmail(value: FlattenMaps<
    {
        login?: string | null | undefined;
        password?: string | null | undefined;
        email?: string | null | undefined;
        createdAt?: Date | null | undefined;
        emailConfirmation?: {
            confirmationCode?: string | UUID | null;
            expirationDate?: Date | null | undefined;
            isConfirmed?: boolean | null | undefined;
        } | null | undefined;
        _id: ObjectId}>): findUserByEmailInterface {
    return {
        id: String(value._id),
        login: value.login || '',
        email: value.email || '',
        emailConfirmation: {
            confirmationCode: value.emailConfirmation?.confirmationCode || '',
            expirationDate: value.emailConfirmation?.expirationDate || new Date(0),
            isConfirmed: value.emailConfirmation?.isConfirmed || false,
        }
    }
}

export function transformUserToLoginOrEmail(value: FlattenMaps<
    {
        login?: string | null | undefined;
        password?: string | null | undefined;
        email?: string | null | undefined;
        createdAt?: Date | null | undefined;
        emailConfirmation?: {
            confirmationCode?: string | UUID | null;
            expirationDate?: Date | null | undefined;
            isConfirmed?: boolean | null | undefined;
        } | null | undefined;
        _id: ObjectId}>): findUserByLoginOrEmailInterface {
    return {
        id: String(value._id),
        password: value.password || ''
    }
}

export function transformUserToCode(value: FlattenMaps<
    {
        login?: string | null | undefined;
        password?: string | null | undefined;
        email?: string | null | undefined;
        createdAt?: Date | null | undefined;
        emailConfirmation?: {
            confirmationCode?: string | UUID | null;
            expirationDate?: Date | null | undefined;
            isConfirmed?: boolean | null | undefined;
        } | null | undefined;
        _id: ObjectId}>): Omit<findUserByEmailInterface, 'login'> {
    return {
        id: String(value._id),
        email: value.email || '',
        emailConfirmation: {
            confirmationCode: value.emailConfirmation?.confirmationCode || '',
            expirationDate: value.emailConfirmation?.expirationDate || new Date(0),
            isConfirmed: value.emailConfirmation?.isConfirmed || false,
        }
    }
}