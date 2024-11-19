import {emailAdapter} from "../utils/adapters/email.adapter";

export const emailManagers = {
    async sendEmailRecoveryMessage(email: string,  confirmationCode: string, operationID: string) {
        return await emailAdapter.sendEmail(email, confirmationCode, operationID);
    }
}