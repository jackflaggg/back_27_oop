import nodemailer from "nodemailer";
import {SETTINGS} from "../../settings";
import {emailTemplates} from "../templates/email.templates";

export const emailAdapter = {
    async sendEmail(emailFrom: string, messageCode: string) {
        try {
            let transporter = nodemailer.createTransport({
                service: 'Mail.ru',
                auth: {
                    user: SETTINGS.EMAIL_NAME,
                    pass: SETTINGS.PASS,
                },
                tls: {
                    rejectUnauthorized: false,
                }
            });

            let resultOne = await transporter.sendMail({
                from: `"Incubator" <${SETTINGS.EMAIL_NAME}>`,
                to: emailFrom,
                subject: 'hello world!',
                html: emailTemplates.registrationEmailTemplate(messageCode)
            });

            return resultOne;

        } catch (err: unknown) {
            console.log('ошибка при отправке сообщения: ' + String(err));
            return null
        }
    },

    async recoveryPasswordEmail(emailFrom: string, messageCode: string) {
        try {
            let transporter = nodemailer.createTransport({
                service: 'Mail.ru',
                auth: {
                    user: SETTINGS.EMAIL_NAME,
                    pass: SETTINGS.PASS,
                },
                tls: {
                    rejectUnauthorized: false,
                }
            });

            let resultTwo = await transporter.sendMail({
                from: `"Incubator" <${SETTINGS.EMAIL_NAME}>`,
                to: emailFrom,
                subject: 'hello world!',
                html: emailTemplates.recoveryPasswordTemplate(messageCode)
            });

            return resultTwo;

        } catch (err: unknown) {
            console.log('ошибка при отправке сообщения: ' + String(err));
            return null
        }
    },
}
