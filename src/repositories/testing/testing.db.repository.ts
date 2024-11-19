import mongoose from "mongoose";

export const testingDbRepositories = {
    async deleteAllData(): Promise<void>{
        try {
            await mongoose.connection.dropDatabase();
            console.log('база данных очищена!')
        } catch(err: unknown){
            console.log('Failed to delete all data', String(err))
            throw err;
        }
    }
}