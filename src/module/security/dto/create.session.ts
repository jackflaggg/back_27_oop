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

    get ipAddress(){
        return this.#ip
    }

    get userAgent(){
        return this.#deviceName
    }

    get deviceId() {
        return this.#deviceId
    }

    get userId(){
        return this.#userId
    }

    get dateDevice(){
        return this.#activeDate
    }

    get token(){
        return this.#refreshToken
    }
    mappingSession(){
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