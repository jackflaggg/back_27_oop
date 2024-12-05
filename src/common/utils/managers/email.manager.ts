import {emailAdapter} from "../adapter/email.adapter";

export const emailManagers = {
    async sendEmailRecoveryMessage(email: string,  confirmationCode: string) {
        return await emailAdapter.sendEmail(email, confirmationCode);
    },
    async sendPasswordRecoveryMessage(email: string,  confirmationCode: string) {
        return await emailAdapter.sendPassword(email, confirmationCode);
    },
}