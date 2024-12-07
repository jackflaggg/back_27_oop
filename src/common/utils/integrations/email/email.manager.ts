import {emailAdapter} from "../../adapter/email.adapter";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const emailManagers = {
    async sendEmailRecoveryMessage(email: string,  confirmationCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
        return await emailAdapter.sendEmail(email, confirmationCode);
    },
    async sendPasswordRecoveryMessage(email: string,  confirmationCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
        return await emailAdapter.sendPassword(email, confirmationCode);
    },
}