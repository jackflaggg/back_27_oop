import {UUID} from "node:crypto";
import {ObjectId, SortDirection} from "mongodb";
import {QueryUsersOutputInterface} from "../../common/utils/features/query.helper";
import {LoginDto, UserCreateDto} from "../../module/user/dto/user.create.dto";
import {transformRecPassInterface} from "../../common/utils/mappers/recovery.password.mapper";
import {JwtPayload} from "jsonwebtoken";
import {CodeFindDto, EmailFindDto, PasswordAndCodeDto} from "../../module/auth/dto/code.dto";
import {RefreshDto} from "../../module/auth/dto/refresh.dto";
import {NextFunction, Request, Response} from "express";

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
    verifyAccessToken: (accessToken: string) => Promise<string | null>
}

export interface authServiceInterface {
    registrationUser: (userDto: UserCreateDto) => Promise<void>
    registrationConfirmation: (dto: CodeFindDto) => Promise<boolean>
    passwordRecovery: (dto: EmailFindDto) => Promise<void>
    newPassword: (dto: PasswordAndCodeDto) => Promise<void>
    emailResending: (dto: EmailFindDto) => Promise<void>
    login: (dto: LoginDto) => Promise<loginInterface>
    authUser: (dto: LoginDto) => Promise<string>
    updateRefreshToken: (dto: RefreshDto) => Promise<loginInterface>
    deleteSessionBeRefreshToken: (dto: RefreshDto) => Promise<boolean>
    meInfo: (dto: RefreshDto) => Promise<void | transformUserToLoginInterface>
}

export interface authRouterInterface {
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>
    refreshToken: (req: Request, res: Response, next: NextFunction) => Promise<void>
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void>
    registrationConfirmation: (req: Request, res: Response, next: NextFunction) => Promise<void>
    registration: (req: Request, res: Response, next: NextFunction) => Promise<void>
    registrationEmailResend: (req: Request, res: Response, next: NextFunction) => Promise<void>
    passwordRecovery: (req: Request, res: Response, next: NextFunction) => Promise<void>
    newPassword: (req: Request, res: Response, next: NextFunction) => Promise<void>
    me: (req: Request, res: Response, next: NextFunction) => Promise<void>
}

export interface userRouterInterface {
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>
    getAllUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>
}