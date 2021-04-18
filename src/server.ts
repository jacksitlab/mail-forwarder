import * as process from 'process';
import MailForwardConfig from './models/config';
import { IMail } from './models/mail';
import { logService } from './services/logService';
import MailServer, { MailCallback } from './services/mailServer';
import MailService from './services/mailService';

const LOG = logService.getLog('MailForwardServer');


class MailForwardServer implements MailCallback {

    private config: MailForwardConfig;
    private mailService: MailService;
    private mailServer: MailServer;

    public constructor(filename: string) {
        this.config = new MailForwardConfig(filename);
        this.mailService = new MailService(this.config.sender);
        this.mailServer = new MailServer(this.config.server, this);
    }
    public onMailReceived(mail: IMail): void {
        this.mailService.sendMail(mail);
    }
    public start() {
        this.mailServer.start();
        LOG.info("started");
    }


}

const args = process.argv.slice(2)
let configFile = "config.json";
if (args.length > 1 && args[0] == "-c") {
    configFile = args[1];
}
const server = new MailForwardServer(configFile);
server.start();