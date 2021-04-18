import MailForwardConfig, { SMTPServerConfig } from "../models/config";
import { logService } from "./logService";
import * as smtp from 'smtp-server'
import * as parser from 'mailparser'
import { IMail } from "../models/mail";
import Mail = require("nodemailer/lib/mailer");

const LOG = logService.getLog('MailServer');
export interface MailCallback {
    onMailReceived(mail: IMail): void;
}

class MailServer {

    private readonly config: SMTPServerConfig;
    private readonly server: smtp.SMTPServer;
    private readonly cb: MailCallback;
    public constructor(config: SMTPServerConfig, onMailReceivedCallback: MailCallback) {
        this.config = config;
        this.cb = onMailReceivedCallback;
        this.server = new smtp.SMTPServer({
            onData: (stream, session, callback) => { this.onMailReceived(stream, session, callback) },
            onAuth: this.onAuthRequest,
            authMethods: ["PLAIN", "LOGIN"],
            allowInsecureAuth: true,
            authOptional: true,
            disableReverseLookup: true

        });
    }
    private onAuthRequest(auth: smtp.SMTPServerAuthentication, session: smtp.SMTPServerSession,
        callback: (err: Error | null | undefined, response?: smtp.SMTPServerAuthenticationResponse | undefined) => void): void {

        LOG.debug(`onAuth ${auth.method} for user ${auth.username} with pw ${auth.password}`);
        callback(null, { user: 123 });

    }

    private onMailReceived(stream: smtp.SMTPServerDataStream, session: smtp.SMTPServerSession,
        callback: (err?: Error | null | undefined) => void): void {
        LOG.debug("onMailReceived")
        parser.simpleParser(stream).then((parsed) => {
            LOG.debug(`received mail:`)
            LOG.debug(`from: ${JSON.stringify(parsed.from)}`)
            LOG.debug(`to  : ${JSON.stringify(parsed.to)}`)
            LOG.debug(`cc  : ${JSON.stringify(parsed.cc)}`)
            LOG.debug(`bcc : ${JSON.stringify(parsed.bcc)}`)
            LOG.debug(`sub : ${parsed.subject}`)
            LOG.debug(`text: ${parsed.text}`)


            const to = this.mapSenderAddress(parsed.to);
            if (!to || to.length==0) {
                LOG.warn("unable to forward mail without destination address")
                return;
            }
            const mail: IMail = {
                to: to,
                isHtml: true,
                subject: parsed.subject || "",
                content: parsed.textAsHtml || parsed.text || ""
            };
            this.cb.onMailReceived(mail);
        }).catch((err) => { LOG.error(err); })


    }
    private mapSenderAddress(to?: parser.AddressObject | parser.AddressObject[]): Mail.Address[] | undefined {
        if (!to) {
            return undefined;
        }
        const output: Mail.Address[] = [];

        if (Array.isArray(to)) {
            to.forEach(sto => {
                sto.value.forEach(adr => {
                    if (adr && adr.address) {
                        output.push({ name: adr.name, address: adr.address })
                    }
                });
            });
        }
        else {
            to.value.forEach(adr => {
                if (adr && adr.address) {
                    output.push({ name: adr.name, address: adr.address })
                }
            });
        }
        return output;
    }
    public start() {
        this.server.listen(this.config.port, this.config.host);
    }
}

export default MailServer;