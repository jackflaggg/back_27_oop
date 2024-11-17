import mongoose from "mongoose";

export const testingDbRepositories = {
    async deleteAllData(): Promise<void>{
        try {
            const currentConnection = mongoose.connection;
            console.log('текущее соединение: ', currentConnection);
            await currentConnection.dropDatabase();
            console.log('база данных очищена!')
        } catch(err: unknown){
            console.log('Failed to delete all data', String(err))
            throw err;
        }
    }
}