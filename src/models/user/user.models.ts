import {UUID} from "node:crypto";
import {ObjectId, SortDirection} from "mongodb";
import {transformUserToOut} from "../../common/utils/mappers/user.mapper";
import {QueryUsersOutputInterface} from "../../common/utils/features/query.helper";
import {UserCreateDto} from "../../module/user/dto/user.create.dto";

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
    createUser: (entity: createUserInterface) => Promise<any>
    updateUserToPass: (userId: string, password: string) =>  Promise<boolean>
    updateUserToEmailConf: (id: string) => Promise<boolean>
    updateUserToCodeAndDate: (userId: ObjectId, code: string, expirationDate: Date) => Promise<boolean>
    deleteUser: (id: string) => Promise<boolean>
    findUserById: (userId: ObjectId) => Promise<void | transformUserToOutInterface>
    findUserByUserId: (userId: string) => Promise<void | transformUserToLoginInterface>
    findUserByEmail: (email: string) => Promise<void | any>
    findUserByLoginOrEmail: (loginOrEmail: string) => Promise<void | any>
    findUserCode: (code: string) => Promise<void | any>
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