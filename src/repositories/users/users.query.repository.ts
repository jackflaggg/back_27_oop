export class UsersQueryRepository {
    async getAllUsers(query: any) {
    }

    async getUserById(id: string) {
        if (id) return id
        return null
    }
}