export class PasswordRecoveryDbRepository  {
    async createCodeAndDateConfirmation(userId: string, code: string, expirationDate: Date) {
    }
    async deleteDate(userId: string){
    }
    async findRecoveryCodeUser(code: string) {
    }
    async updateRecoveryCode(userId: string, code: string) {
    }
}