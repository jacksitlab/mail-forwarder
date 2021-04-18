import { SMTPConfig } from "../models/config";
import * as nodemailer from 'nodemailer';
import { logService } from "./logService";
import Mail = require("nodemailer/lib/mailer");
import { IMail } from "../models/mail";
const LOG = logService.getLog('MailService');
class MailService {
    private static readonly RESETPASSWORD_SUBJECT = "forgot your password";
    private static readonly REGISTERED_SUBJECT = "welcome";
    private readonly config: SMTPConfig;
    public constructor(config: SMTPConfig) {
        this.config = config;
    }

    public sendMail(mail: IMail, insecure = false): Promise<any> {
        const result = new Promise<any>((resolve, reject) => {
            const options = {
                host: this.config.host,
                port: this.config.port,
                secure: this.config.secure, // true for 465, false for other ports
                auth: {
                    user: this.config.username, // generated ethereal user
                    pass: this.config.password // generated ethereal password
                },

            }
            const insecureOptions = insecure ? {
                secure: false,
                // here it goes
                tls: { rejectUnauthorized: false },
            } : {};
            let transporter = nodemailer.createTransport({
                ...options, ...insecureOptions
            }
            );
            let content: { html?: string, text?: string } = mail.isHtml ? { html: mail.content } : { text: mail.content };
            transporter.sendMail({
                ...{
                    from: { name: "", address: this.config.email }, // sender address
                    to: mail.to, // list of receivers
                    subject: mail.subject, // Subject line
                },
                ...content
            }).then((info) => {
                LOG.debug("Message sent: {0}", info.messageId);
                resolve(info);
            }).catch((error) => {
                reject(error);
            });
        });
        return result;
    }
}
export default MailService;