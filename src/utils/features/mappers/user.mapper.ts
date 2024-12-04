import {ObjectId} from "mongodb";
import {FlattenMaps} from "mongoose";
import {UUID} from "node:crypto";

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
            _id: ObjectId}>) {
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
        _id: ObjectId}>) {
        return {
                email: value.email || '',
            login: value.login || '',
                userId: value._id || '',
        }
}