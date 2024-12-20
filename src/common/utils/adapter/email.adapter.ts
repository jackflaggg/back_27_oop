import {SETTINGS} from "../../config/settings";
import nodemailer from "nodemailer";
import {emailTemplates} from "../../../templates/email.templates";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {injectable} from "inversify";

export const emailAdapter = {
    async sendEmail(emailFrom: string, messageCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
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

            return await transporter.sendMail({
                from: `"Incubator" <${SETTINGS.EMAIL_NAME}>`,
                to: emailFrom,
                subject: 'hello world!',
                html: emailTemplates.registrationEmailTemplate(messageCode),
            });

        } catch (err: unknown) {
            console.log('ошибка при отправке сообщения: ' + String(err));
            return null
        }
    },

    async sendPassword(emailFrom: string, messageCode: string): Promise<SMTPTransport.SentMessageInfo | null> {
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

            return await transporter.sendMail({
                from: `"Incubator" <${SETTINGS.EMAIL_NAME}>`,
                to: emailFrom,
                subject: 'hello world!',
                html: emailTemplates.recoveryPasswordTemplate(messageCode),
            });

        } catch (err: unknown) {
            console.log('ошибка при отправке сообщения: ' + String(err));
            return null
        }
    },
}