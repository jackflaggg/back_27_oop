import {UUID} from "node:crypto";
import {ObjectId, SortDirection} from "mongodb";
import {transformUserToOut} from "../../common/utils/mappers/user.mapper";
import {QueryUsersOutputInterface} from "../../common/utils/features/query.helper";
import {UserCreateDto} from "../../module/user/dto/user.create.dto";
import {transformRecPassInterface} from "../../common/utils/mappers/recovery.password.mapper";
import {JwtPayload} from "jsonwebtoken";

export interface emailInfo {
    confirmationCode: UUID | string,
    expirationDate: Date | null | string,
    isConfirmed: boolean
}

export interface createUserInterface {
    login?: string,
    password?: string,
    email?: string,
    createdAt?: Date,
    emailConfirmation?: {
        confirmationCode?: string | UUID | null;
        expirationDate?: Date | null | undefined;
        isConfirmed?: boolean | null | undefined;
    } | null | undefined
}

export interface findUserByEmailInterface {
    id: string,
    login: string,
    email: string,
    emailConfirmation: {
        confirmationCode: string | UUID | null;
        expirationDate: Date | null | undefined;
        isConfirmed: boolean | null | undefined;
    }
}

export interface findUserByLoginOrEmailInterface {
    id: string,
    password: string
}

export interface transformCreateUserInterface {
    id: string,
    login: string,
    email: string,
    createdAt: Date | string,
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

export interface transformUserToOutInterface {
    id: string,
    login: string,
    email: string,
    createdAt: Date | string,
}

export interface transformUserToLoginInterface {
    userId: string | ObjectId,
    login: string,
    email: string,
}

export interface userInterface {
    userId: ObjectId,
    userLogin: string,
    userEmail: string,
}

export interface userDbRepoInterface {
    createUser: (entity: createUserInterface) => Promise<transformCreateUserInterface>
    updateUserToPass: (userId: string, password: string) =>  Promise<boolean>
    updateUserToEmailConf: (id: string) => Promise<boolean>
    updateUserToCodeAndDate: (userId: ObjectId, code: string, expirationDate: Date) => Promise<boolean>
    deleteUser: (id: string) => Promise<boolean>
    findUserById: (userId: ObjectId) => Promise<void | transformUserToOutInterface>
    findUserByUserId: (userId: string) => Promise<void | transformUserToLoginInterface>
    findUserByEmail: (email: string) => Promise<void | findUserByEmailInterface>
    findUserByLoginOrEmail: (loginOrEmail: string) => Promise<void | findUserByLoginOrEmailInterface>
    findUserCode: (code: string) => Promise<void | Omit<findUserByEmailInterface, 'login'>>
}

export interface getAllUser {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: transformUserToOutInterface[]
}

export interface userQueryRepoInterface {
    getAllUsers: (query: QueryUsersOutputInterface) => Promise<getAllUser>
    getUserById: (id: string) => Promise<userInterface | void>
}

export interface userServiceInterface {
    createUser: (dto: UserCreateDto) => Promise<transformUserToOutInterface | void>
    deleteUser: (userId: string) => Promise<boolean>
    validateUser: (userId: ObjectId) => Promise<transformUserToOutInterface | void>
}

export interface userEntityMapCreateAdmin {
    login: string,
    email: string,
    password: string,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: null,
        isConfirmed: boolean
    }
}

export interface userEntityMapCreateClient {
    login: string,
    email: string,
    password: string,
    createdAt: Date,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: false
    }
}

export interface PasswordRecoveryDbRepositoryInterface {
    createCodeAndDateConfirmation: (userId: ObjectId, code: string, expirationDate: Date | string | null) => Promise<transformRecPassInterface>
    findRecoveryCodeUser: (code: string) => Promise<transformRecPassInterface | void>
    updateStatus: (id: ObjectId) => Promise<boolean>
}

export interface loginInterface {
    jwt: string | void
    refresh: string | void
}

export interface jwtStrategyInterface {
    createAccessToken: (payload: string) => Promise<string | void>;
    createRefreshToken: (userId: string, deviceId: string) => Promise<string | void>;
    decodeToken: (token: string) => Promise<JwtPayload | null>
    verifyRefreshToken: (refreshToken: string) => Promise<JwtPayload | null>
}