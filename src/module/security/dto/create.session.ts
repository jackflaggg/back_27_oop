import {mappingSessionInterface} from "../../../models/session/session.models";

export class Session {
    #ip: string
    #deviceName: string
    #deviceId: string
    #userId: string
    #activeDate: Date
    #refreshToken: string
    constructor(ip: string,
                deviceName: string,
                deviceId: string,
                userId: string,
                activeDate: Date,
                refreshToken: string) {
        this.#ip = ip
        this.#deviceName = deviceName
        this.#deviceId = deviceId
        this.#userId = userId
        this.#activeDate = activeDate
        this.#refreshToken = refreshToken
    }

    get ipAddress(): string {
        return this.#ip
    }

    get userAgent(): string {
        return this.#deviceName
    }

    get deviceId(): string {
        return this.#deviceId
    }

    get userId(): string{
        return this.#userId
    }

    get dateDevice(): Date {
        return this.#activeDate
    }

    get token(): string {
        return this.#refreshToken
    }
    mappingSession(): mappingSessionInterface {
        return {
            issuedAt: this.dateDevice,
            deviceId: this.deviceId,
            userId: this.userId,
            ip: this.ipAddress,
            lastActiveDate: new Date(),
            deviceName: this.userAgent,
            refreshToken: this.token
        }
    }
}