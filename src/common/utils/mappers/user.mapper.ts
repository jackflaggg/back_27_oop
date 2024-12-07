import {ObjectId} from "mongodb";
import {FlattenMaps} from "mongoose";
import {UUID} from "node:crypto";
import {
    createUserInterface, transformCreateUserInterface,
    transformUserToLoginInterface,
    transformUserToOutInterface,
    userInterface
} from "../../../models/user/user.models";

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