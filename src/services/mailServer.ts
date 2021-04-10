import MailForwardConfig, { SMTPServerConfig } from "../models/config";
import { logService } from "./logService";
import * as smtp from 'smtp-server'
import * as parser from 'mailparser'

const LOG = logService.getLog('MailServer');

class MailServer {

    private readonly config: SMTPServerConfig;
    private server: smtp.SMTPServer;
    public constructor(config: SMTPServerConfig) {
        this.config = config;
        this.server = new smtp.SMTPServer({
            onData: this.onMailReceived,
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
        parser.simpleParser(stream, {}, (err, parsed) => {
            if (err) {
                LOG.error(err);
            }
            else {
                LOG.debug(`received mail:`)
                LOG.debug(`from: ${parsed.from}`)
                LOG.debug(`to  : ${parsed.to}`)
                LOG.debug(`cc  : ${parsed.cc}`)
                LOG.debug(`bcc : ${parsed.bcc}`)
                LOG.debug(`sub : ${parsed.subject}`)
                LOG.debug(`text: ${parsed.text}`)

            }
        });

    }
    public start() {
        this.server.listen(this.config.port, this.config.host);
    }
}

export default MailServer;